import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/rx';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as Fuse from 'fuse.js';
import { Subject } from 'rxjs/Subject';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'np-grid',
  templateUrl: './np-grid.component.html',
  styleUrls: ['./np-grid.component.css']
})
export class NpGridComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('np-grid') gridSettings: GridSettings
  @Input()
  set data(val) {
    this._data.next(val);
  }
  get data() {
    return this._data.getValue();
  }
  @Output() action: EventEmitter<any> = new EventEmitter();

  // #region local_variables
    gridData: GridData = {columns: [], rows: []};
    allData: GridData = {columns: [], rows: []};
    private ngUnsubscribe: Subject<any> = new Subject();

    // this
    private _data: BehaviorSubject<{}[]> = new BehaviorSubject([]);
    paginator: Paginator = new Paginator();
    idColumn = '';
      // this but for data out of the grid
      actionResults: ActionResult[] = [];

    // for sorting
    sortDirection = 0;
    currentSortedColumn = '';

    // search
    fuseOptions = {
      shouldSort: true,
      threshold: 0.5,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: []
    };

    // checking items
    headerIsChecked: boolean;
    checkedItems = [];

    // view
    dataColumns: HeaderColumn[] = [];
    dataRows: {}[] = [];
    additionalDataRows: {} = {};
    extraCols = 0;
    additionalColumns = [];
    currentExtraColumn = -1;
    tdWidth;

    // view flags
    displayLeadingGap = false;
    displayEndingGap = false;
    nextDisabled;
    prevDisabled;
    pagerFlag;
    dataEditable: boolean;
  // #endregion

  constructor() {}

  ngOnInit() {
    this._data
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res) => {
      this.gridData.columns = this.parseColumns(this.gridSettings.columns);
      this.dataColumns = this.parseColumnHeaders(this.gridSettings.columns);
      if (this.gridSettings.additionalColumns) {
        this.additionalColumns = this.gridSettings.additionalColumns;
      }
      this.fuseOptions.keys = this.gridSettings.searchBy;
      this.tdWidth = ((100 - (100 / 12)) / this.gridData.columns.length) + '%';
      this.gridData.rows = this.allData.rows = res;
      if (typeof(this.gridSettings.pagingOptions) === 'undefined') {
        this.pagerFlag = true;
      }
      this.paginator.rowsPerPage = this.pagerFlag ? 10 : this.gridSettings.pagingOptions[0];
      this.paginator = this.initializePager(this.paginator);
      this.updExtraCols();
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initializePager(paginator: Paginator) {
    this.render(1, paginator.rowsPerPage);
    return paginator;
  }

  parseColumns(columnsToParse) {
    const columnPropertyNames: string[] = [];
    for (let i = 0; i < columnsToParse.length; i++) {
    const foreignColumn = columnsToParse[i];
      if (foreignColumn.display) {
       columnPropertyNames.push(foreignColumn.colName);
      }
    }
    return columnPropertyNames;
  }
  parseColumnHeaders(columnsToParse: Column[]): HeaderColumn[] {
    const dataCols: HeaderColumn[] = [];
    for (let i = 0; i < columnsToParse.length; i++) {
      const foreignColumn = columnsToParse[i];
      const header: HeaderColumn = {name: '', canSort: false};
      if (foreignColumn.display) {
        // setting header columns to value given by user
        header.name = foreignColumn.display;
      }

      // and checking whether or not user chose them to be sortable
      if (foreignColumn.sort) {
        header.canSort = true;
      } else {
        header.canSort = false;
      }

      // the second cond ensures that only the first col to be marked with 'id' becomes the id
      if (foreignColumn.id && this.idColumn === '') {
        this.idColumn = foreignColumn.colName;
      }

      dataCols.push(header);
    }
    return dataCols;
  }

  toggleSort(headerCol: HeaderColumn) {
    // if column toggling sort is not currently sorted, start sort type from asc
    if (this.currentSortedColumn !== headerCol.name) {
      this.currentSortedColumn = headerCol.name;
      this.sortDirection = 1;
    } else {
      // else change it's sort type retaining currentSortedColumn
      this.sortDirection++;
    }

    // reset sort type when max is reached
    if (this.sortDirection > 2) {
      this.sortDirection = 0;
    }
    switch (this.sortDirection) {
      case 0:
        // default sort
        this.sortColumn(headerCol.name, '');
        break;
      case 1:
        this.sortColumn(headerCol.name, 'asc');
        break;
      case 2:
        this.sortColumn(headerCol.name, 'desc');
        break;
      default:
        console.log('Invalid sort order');
    }
  }

  sortColumn(colDisplayName: string, dir: string) {
    // if default, render data as is and return (!important)
    if (dir === '') {  this.renderRows(this.allData.rows, this.paginator); return; }

    const data = this.allData.rows.slice();
    let chosenProp;

    // getting the underlying column name
    for (let i = 0; i < this.gridSettings.columns.length; i++) {
      if (this.gridSettings.columns[i].display === colDisplayName) {
        chosenProp = this.gridSettings.columns[i].colName;
      }
    }

    // got this awesome algo from the world wide web
    const sortedData = data.sort((compareThis, withThis) => {
      const arbitValA = isNaN(+compareThis[chosenProp]) ? compareThis[chosenProp] : +compareThis[chosenProp];
      const arbitValB = isNaN(+withThis[chosenProp]) ? withThis[chosenProp] : +withThis[chosenProp];

      return (arbitValA < arbitValB ? -1 : 1) * (dir === 'asc' ? 1 : -1);
    });
    this.renderRows(sortedData, this.paginator);
  }

  filterItems(filterEl: HTMLInputElement) {
    const term = filterEl.value.replace(/\s+/g, '');
    if (term === '' || term === null || +term === NaN || +term === 0) {
      this.render(1, this.paginator.rowsPerPage, this.allData.rows);
      return;
    }
    const fuse = new Fuse(this.allData.rows, this.fuseOptions);
    const result = fuse.search(filterEl.value.toString());
    this.render(1, this.paginator.rowsPerPage, result);

  }

  renderRows(allRows: {}[], paginator: Paginator) {
    this.paginator.pageCount = this.pageCount(paginator, this.allData.rows.length);
    this.updDisabled(); // this function uses lastPage, which is updated in pageCount()
    this.gridData.rows = [];
    if (allRows.length <= 0) {
      return;
    } else if (allRows.length > 10) {
      const startAt = this.paginator.currentPage * this.paginator.rowsPerPage - this.paginator.rowsPerPage;
      let stopAt = this.paginator.currentPage * this.paginator.rowsPerPage;
      if (this.paginator.currentPage === this.paginator.lastPage) {
        stopAt = allRows.length;
      }
      for (let i = startAt; i < stopAt; i++) {
        this.gridData.rows.push(allRows[i]);
      }
    } else {
      this.gridData.rows = allRows;
    }
  }

  render(currentPage: number, rowsPerPage?: number, customData?: {}[]) {
    this.paginator.currentPage = currentPage;
    if (rowsPerPage) {
      this.paginator.rowsPerPage = rowsPerPage;
    }
    if (customData) {
      this.renderRows(customData, this.paginator);
      return;
    }
    this.renderRows(this.allData.rows, this.paginator);
  }

  renderAdditionalCols() {
      for (let i = 0; i < this.allData.rows.length; i++) {
        const foreignRow = this.allData.rows[i];
        const displayRow = {};
        for (let j = 0; j < this.additionalColumns.length; j++) {
          const currentDisplayColumnObject = this.additionalColumns[j];
          if (foreignRow[currentDisplayColumnObject['colName']]) {
            displayRow[currentDisplayColumnObject['colName']] = foreignRow[currentDisplayColumnObject['colName']];
          }
        }
        this.additionalDataRows = displayRow; // renders
      }
  }

  // #region grid_action_methods
    nextPage()  {
      if (!this.nextDisabled) {
        this.render(++this.paginator.currentPage);
      }
    }
    previousPage()  {
      if (!this.prevDisabled) {
        this.render(--this.paginator.currentPage);
      }
    }
    // when user changes number of rows per page in the dropdown
    selectRowsPerPg(opts: HTMLSelectElement) {
      const rowsPerPage = parseInt(opts.selectedOptions[0].value, 10);
      this.render(1, rowsPerPage);
    }

    collapseDataRow() {
      // since it collapses the data row, might aswell use it.
      this.dataRowClicked(-1);
    }
    // expands/collapses an expandable row
    dataRowClicked(index: number, rowObj?)  {
      // grid row responds to click event (by momentarily coloring the row border)
      if (this.gridSettings.click) {
        $('.npg-datarow').eq(index).addClass('clicked');
        setTimeout(function() {
          $('.npg-datarow').eq(index).removeClass('clicked');
        }, 150);
      }
      // first action is to toggle row open/close if there're additional cols

      // toggle only when there aren't cells currently being edited
      // or if index is explicitly set from view to -1 (by the cancelling button)
      if (!this.dataEditable || index === -1) {
        this.renderAdditionalCols();
        // this does the toggling
        this.currentExtraColumn = this.currentExtraColumn === -1 ? index : -1;
        // if the addtional columns are 'cancelled'
        if (index === -1) {
          // desable all editing
          this.dataEditable = false;
          // clear all items marked for delete/update
          this.actionResults = [];
        }
      }

      // second action is to send the clicked row's data to the parent
      if (this.gridSettings.click) {
        const ar = new ActionResult();
        ar.action = 'click'
        ar.row = rowObj;
        this.action.emit(ar);
      }
    }

    toggleAllChecked() {
      const checkEvent = new Event('change');
      this.headerIsChecked = this.headerIsChecked ? false : true;

      const checkboxes = document.querySelectorAll('td>[type=checkbox]');
      for (let i = 0; i < checkboxes.length; i++) {
        // i thought either of the following statements would suffice for:
        // 1. visually checking the checkbox
        // 2. dispatching the change event to show when checkbox value changes
        // turns out you need both.
        // TODO: check what events are fired when you normally click a checkbox
        (<HTMLInputElement>checkboxes[i]).checked = this.headerIsChecked;
        checkboxes[i].dispatchEvent(checkEvent);
      }
    }
    checkItemRow(checkBoxEl: HTMLInputElement, rowObj) {
      if (checkBoxEl.checked) {
        this.checkedItems.push(rowObj);
      } else {
        const index = $.inArray(rowObj, this.checkedItems);
        if (index !== -1) {
          this.checkedItems.splice(index, 1);
        }
      }
    }

    enableEdits() {
      this.dataEditable = !this.dataEditable;
    }

    // forces update of the disabled attribute of my pager buttons
    updDisabled() {
      this.nextDisabled = this.paginator.lastPage === this.paginator.currentPage;
      this.prevDisabled = this.paginator.firstPage === this.paginator.currentPage;
    }
    // forces update of the extraCols flag that controls colspans
    // since angular fails to detect its change idk why
    updExtraCols() {
      let extraCols = 0;
      if (this.gridSettings.multiselect) {
        extraCols++;
      }
      if (!this.pagerFlag && this.gridSettings.pagingOptions.length > 0) {
        extraCols--;
      }
      this.extraCols = extraCols;
    }

  // #endregion

  // called when user updates contenteditable fields (non-additional data)
  itemFieldChanged(rowObj: {}, colName: string, tdCell: HTMLTableDataCellElement) {
    const actionResult: ActionResult = {
      action: 'update',
      row: rowObj,
      col: colName,
      data: tdCell.innerText
    };
    this.updateActionResult(actionResult);
  }

  // when user updates any addtional fields
  additionalItemFieldChanged(rowObj: {}, col, tdCell: HTMLTableDataCellElement) {
    this.itemFieldChanged(rowObj, col.colName, tdCell);
  }

  updateActionResult(actionResult: ActionResult) {
    // if we have touched any rows, do the things..
    if (this.actionResults.length > 0) {
      const counter = this.actionResults.length;
      for (let i = 0; i < counter; i++) {
        // if this row is touched
        if (this.actionResults[i].row === actionResult.row && this.actionResults[i].col === actionResult.col) {
          // update its data
          this.actionResults[i].data = actionResult.data;
          return;
        } else if (i === (counter - 1)) {
          // else if this is the last loop, clearly this row isn't in our touched rows, add it
          this.actionResults.push(actionResult);
        }
      }
    } else {
      // if no updated rows exist, add our first entry :)
      this.actionResults.push(actionResult);
    }
  }

  updateData() {
    if (this.actionResults.length > 0) {
      this.action.emit(this.actionResults);

    }
    this.dataEditable = false;
    this.collapseDataRow();
    this.actionResults = [];
  }
  deleteItem(rowObj) {
    this.actionResults = [];
    this.actionResults.push({action: 'delete', row: rowObj});
    this.action.emit(this.actionResults);
    this.collapseDataRow();
    this.actionResults = [];
  }
  deleteMany(rowObjs) {
    this.actionResults = [];
    for (let i = 0; i < rowObjs.length; i++) {
      this.actionResults.push({action: 'delete', row: rowObjs[i]});
    }
    this.action.emit(this.actionResults);
    this.collapseDataRow();
    this.actionResults = [];
    this.checkedItems = [];
    this.toggleAllChecked();
  }

  // calculates the number of pages on display
  // needed when changing number of rows per column
  pageCount(paginator: Paginator, rowCount: number) {
    let pageCount;
    if (rowCount > 10) {
      pageCount = Math.ceil(rowCount / paginator.rowsPerPage);
      if (pageCount > 1) {
        this.paginator.lastPage = pageCount;
      } else if (pageCount === 1) {
        this.paginator.lastPage = 1;
      }
      return pageCount;
    } else if (rowCount < 10)  {
      return 1;
    }
  }
}

// #region helper classes
  class GridSettings {
    columns: Column[];
    additionalColumns: Column[];
    searchBy: string[];
    pagingOptions: number[];
    multiselect;
    click;
    hover;
  }

  class GridData {
    columns: string[]
    rows: {}[];
  }

  class Column {
    colName: string;
    display?: string;
    sort?: boolean;
    id?: boolean;
  }

  class Paginator {
    currentPage: number;
    pageCount: number;
    rowsPerPage: number;
    firstPage: number;
    lastPage: number;

    constructor() {
      this.pageCount = this.firstPage = this.lastPage = this.currentPage = 1;
      this.rowsPerPage = 10;
    }
  }

  class HeaderColumn {
    name: string;
    canSort?: boolean;
  }

  class ActionResult {
    action: string;
    row: {};
    col?: string;
    data?: string;
  }
// #endregion

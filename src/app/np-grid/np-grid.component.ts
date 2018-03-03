import { Observable } from 'rxjs/rx';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'np-grid',
  templateUrl: './np-grid.component.html',
  styleUrls: ['./np-grid.component.css']
})
export class NpGridComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('np-grid') gridSettings: GridSettings
  @Input() data: Observable<{}[]>

  allData: GridData = {columns: [], rows: []};
  paginator: Paginator = new Paginator();

  // for sorting
  sortDirection = 0;
  currentSortedColumn = '';

  // view
  displayedData: GridData = {columns: [], rows: []};
  extraCols = 0;
  headerCols: HeaderColumn[] = [];
  tdWidth;

  // view flags
  displayLeadingGap = false;
  displayEndingGap = false;
  nextDisabled;
  prevDisabled;
  pagerFlag;

  constructor() {}

  ngOnInit() {
    this.data.subscribe((res) => {
      this.displayedData.columns = this.allData.columns = this.parseColumns(this.gridSettings.columns);
      this.tdWidth = ((100 - (100 / 12)) / this.displayedData.columns.length) + '%';
      this.allData.rows = this.parseRows(res, this.displayedData.columns);
      if (typeof(this.gridSettings.pagingOptions) === 'undefined') {
        this.pagerFlag = true;
      }
      this.paginator.rowsPerPage = this.pagerFlag ? 10 : this.gridSettings.pagingOptions[0];
      this.paginator = this.initializePager(this.paginator);
      this.updExtraCols();
    });
  }

  initializePager(paginator: Paginator) {
    this.render(1, paginator.rowsPerPage);
    return paginator;
  }

  parseColumns(columnsToParse: Column[]): string[] {
    const output: string[] = [];
    for (let i = 0; i < columnsToParse.length; i++) {
      const foreignColumn = columnsToParse[i];
      if (foreignColumn.display) {
        output.push(foreignColumn.colName);
        // setting header columns to value given by user
        // and checking whether or not user chose them to be sortable
        const header: HeaderColumn = {name: '', canSort: false};
        header.name = foreignColumn.display;
        if (foreignColumn.sort) {
          header.canSort = true;
        } else {
          header.canSort = false;
        }
        this.headerCols.push(header);
      }
    }
    return output;
  }

  parseRows(rowsToParse: {}[], displayedCols: string[]): {}[] {
    const output: {}[] = [];
    for (let i = 0; i < rowsToParse.length; i++) {
      const foreignRow = rowsToParse[i];
      const displayRow = {};
      for (let j = 0; j < displayedCols.length; j++) {
        const currentDisplayColumn = displayedCols[j];
        if (foreignRow[currentDisplayColumn]) {
          displayRow[currentDisplayColumn] = foreignRow[currentDisplayColumn];
        }
      }
      output.push(displayRow);
    }
    return output;
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

  renderRows(allRows: {}[], paginator: Paginator) {
    this.displayedData.rows = [];
    this.paginator.pageCount = this.pageCount(paginator, this.allData.rows.length);
    this.updDisabled(); // uses lastPage, which is updated in pageCount()
    if (allRows.length <= 0) {
      console.log('nothing to render');
    } else if (allRows.length > 10) {
      const startAt = this.paginator.currentPage * this.paginator.rowsPerPage - this.paginator.rowsPerPage;
      let stopAt = this.paginator.currentPage * this.paginator.rowsPerPage;
      if (this.paginator.currentPage === this.paginator.lastPage) {
        stopAt = allRows.length;
      }
      for (let i = startAt; i < stopAt; i++) {
        this.displayedData.rows.push(allRows[i]);
      }
    } else {
      this.displayedData.rows = allRows;
    }
  }

  render(currentPage: number, rowsPerPage?) {
    this.paginator.currentPage = currentPage;
    if (rowsPerPage) {
      this.paginator.rowsPerPage = rowsPerPage;
    }
    this.renderRows(this.allData.rows, this.paginator);
  }
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
  selectRowsPerPg(opts: HTMLSelectElement) {
    const rowsPerPage = parseInt(opts.selectedOptions[0].value, 10);
    this.render(1, rowsPerPage);
  }

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
  updDisabled() {
    this.nextDisabled = this.paginator.lastPage === this.paginator.currentPage;
    this.prevDisabled = this.paginator.firstPage === this.paginator.currentPage;
  }
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
}

class GridSettings {
  columns: Column[];
  pagingOptions: number[];
  multiselect;
}

class GridData {
  columns: string[]
  rows: {}[];
}

class Column {
  colName: string;
  display?: string;
  sort?: boolean;
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
  canSort: boolean;
}

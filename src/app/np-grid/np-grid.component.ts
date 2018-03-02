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

  allData: GridData = {columns: [], rows: []};
  paginator: Paginator = new Paginator();

  // view
  displayedData: GridData = {columns: [], rows: []};

  // view flags
  displayLeadingGap = false;
  displayEndingGap = false;
  nextDisabled;
  prevDisabled;

  constructor() {}

  ngOnInit() {
    this.displayedData.columns = this.allData.columns = this.parseColumns(this.gridSettings.columns);
    this.allData.rows = this.parseRows(this.gridSettings.data, this.displayedData.columns);
    this.paginator.rowsPerPage = this.gridSettings.pagingOptions[0];
    this.paginator = this.initializePager(this.paginator);
  }

  initializePager(paginator: Paginator) {
    this.render(1, paginator.rowsPerPage);
    return paginator;
  }

  parseColumns(columnsToParse: Column[]): string[] {
    const output: string[] = [];
    for (let i = 0; i < columnsToParse.length; i++) {
      const foreignColumn = columnsToParse[i];
      if (foreignColumn.display || foreignColumn.display === 'display') {
        output.push(foreignColumn.colName);
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
}

class GridSettings {
  columns: Column[];
  data: {}[];
  extraCols: number;
  pagingOptions: number[];
}

class GridData {
  columns: string[]
  rows: {}[];
}

class Column {
  colName: string;
  display?: boolean | string;
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

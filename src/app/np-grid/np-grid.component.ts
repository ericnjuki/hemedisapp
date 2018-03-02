import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'np-grid',
  templateUrl: './np-grid.component.html',
  styleUrls: ['./np-grid.component.css']
})
export class NpGridComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('np-grid') np_grid_settings: GridSettings

  gridData: GridData = {columns: [], rows: []};
  constructor() { }

  ngOnInit() {
    this.gridData.columns = this.renderColumns(this.np_grid_settings.columns);
    this.gridData.rows = this.renderRows(this.np_grid_settings.data, this.gridData.columns);

  }

  renderColumns(columnsToRender: Column[]): string[] {
    const renderThese: string[] = [];
    for (let i = 0; i < columnsToRender.length; i++) {
      const foreignColumn = columnsToRender[i];
      if (foreignColumn.display || foreignColumn.display === 'display') {
        renderThese.push(foreignColumn.colName);
      }
    }
    return renderThese;
  }

  renderRows(rowsToRender: {}[], displayedCols: string[]): {}[] {
    const renderThese: {}[] = [];
    for (let i = 0; i < rowsToRender.length; i++) {
      const foreignRow = rowsToRender[i];
      const displayRow = {};
      for (let j = 0; j < displayedCols.length; j++) {
        const currentDisplayColumn = displayedCols[j];
        if (foreignRow[currentDisplayColumn]) {
          displayRow[currentDisplayColumn] = foreignRow[currentDisplayColumn];
        }
      }
      renderThese.push(displayRow);
    }
    return renderThese;
  }
}

class GridSettings {
  columns: Column[];
  data: {}[];
}

class GridData {
  columns: string[]
  rows: {}[];
}

class Column {
  colName: string;
  display?: boolean | string;
}

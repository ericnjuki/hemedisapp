import { Component, OnInit, ViewChild } from '@angular/core';
import { ExampleDataSource } from 'app/items/stock/example.datasource';
import { ExampleDatabase } from 'app/items/stock/example.database';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemService } from 'app/services/items.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  displayedColumns = ['itemName', 'quantity', 'unit', 'purchaseCost', 'sellingPrice'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
  }

}

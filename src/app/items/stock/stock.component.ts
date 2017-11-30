import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemService } from 'app/services/items.service';
import { StockDataSource } from 'app/items/stock/stock.datasource';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material/table';
import { IItem } from 'app/interfaces/item.interface';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, AfterViewInit {
  displayedColumns = ['itemName', 'quantity', 'unit', 'purchaseCost', 'sellingPrice'];
  dataSource: StockDataSource | null | any;
  isContenteditable = true;
  updatedItems = [];
  itemToUpdate;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private itemService: ItemService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) {
  }

  ngOnInit() {
    this.dataSource = new StockDataSource(this.itemService);
    $(function () {
      $('[contenteditable=true]').focus(function () {
        const val = this.innerHTML;
        const $this = $(this);
        $this.val('');
        setTimeout(function () {
          $this.val(val);
        }, 1);
      });
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  onItemInput(row: IItem, matCell: HTMLInputElement) {
    this.itemToUpdate = {
      'itemId': row.itemId,
      'itemName': row.itemName,
      'quantity': row.quantity,
      'unit': row.unit,
      'purchaseCost': row.purchaseCost,
      'sellingPrice': row.sellingPrice

    }

    if (this.updatedItems.length === 0) {
      // First item from my table to be updated
      this.updatedItems.push(this.addUpdatedItems(this.itemToUpdate, matCell));
    } else {
      for (let i = 0; i < this.updatedItems.length; i++) {
        if (this.updatedItems[i].itemId === this.itemToUpdate.itemId) {
          // This item has been updated before, replace it with a new update
          this.updatedItems.push(this.addUpdatedItems(this.updatedItems[i], matCell));
          this.updatedItems.splice(i, 1);
          return;
        }
      }
      // This item hasn't been updated before, simply add it to my updated items
      this.updatedItems.push(this.addUpdatedItems(this.itemToUpdate, matCell));
    }
  }
  addUpdatedItems(rowData, cellData): IItem {
    // loop through displayed columns
    for (const col of this.displayedColumns) {
      // angular(i think) assigns each mat-cell a class
      // corresponding to the column it's in e.g mat-column-itemName
      if (cellData.getAttribute('class').indexOf(col) !== -1) {
        switch (col) {
          case 'itemName':
            rowData[col] = cellData.innerHTML;
            return rowData;
          case 'quantity':
            rowData[col] = cellData.innerHTML;
            return rowData;
          case 'unit':
            rowData[col] = cellData.innerHTML;
            return rowData;
          case 'purchaseCost':
            rowData[col] = cellData.innerHTML;
            return rowData;
          case 'sellingPrice':
            rowData[col] = cellData.innerHTML;
            return rowData;
        }
      } else {
        console.log('this is an impossible error for now, you\'re forked!');
      }
    }
    return rowData;
  }
  postUpdate() {
    const firstToast = this.addToast('wait');
    this.itemService.updateItems(this.updatedItems)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast();
        console.log(response);
        this.updatedItems = [];
      });
  }

  addToast(toastType?) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: 'Update Status',
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    if (toastType === 'wait') {
      toastOptions.msg = 'updating...';
      this.toastyService.wait(toastOptions);
    } else {
      toastOptions.msg = 'Update successful!';
      this.toastyService.success(toastOptions);
    }
    return toastId;
  }
}

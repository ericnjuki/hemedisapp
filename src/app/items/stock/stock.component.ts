import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemService } from 'app/services/items.service';
import { StockDataSource } from 'app/items/stock/stock.datasource';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material/table';
import { IItem } from 'app/interfaces/item.interface';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Fuse from 'fuse.js';
import { Item } from 'app/shared/item.model';
import { NpModalOptions } from 'app/shared/np-modal-options';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  displayedColumns = ['multiselect', 'itemName', 'quantity', 'unit', 'purchaseCost', 'sellingPrice', 'actions'];
  dataSource: StockDataSource;
  isContenteditable = false;
  updatedItems = [];
  itemToUpdate;
  searchResults: IItem[] = [];
  fuseOptions = {
    shouldSort: true,
    threshold: 0.5,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['itemName']
  };
  showDialog = false;
  options: NpModalOptions = new NpModalOptions();
  itemsToDelete: number[] = [];

  // dealing with checked items
  headerIsChecked;
  allChecked;
  checkAll = false;
  checkedItems = [];
  checkedRowItems = [];

  // configuring np-grid
  npGridConfig = {
    columns: [
      {colName: 'bla', display: 'display'},
      {colName: 'nada', display: false},
      {colName: 'surf', display: true}
    ],
    data: [
      {nada: 'ya', bla: 'ka', surf: 'in'},
      {nada: 'yaa', bla: 'kaka', surf: 'ins'},
      {nada: 'yaaa', bla: 'kakaka', surf: 'insi'},
      {nada: 'yaaaa', bla: 'kakakaka', surf: 'insid'},
      {nada: 'yaaaaa', bla: 'kakakakaka', surf: 'inside'}
    ]
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private itemService: ItemService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) {
    }

  ngOnInit() {
    this.dataSource = new StockDataSource(this.paginator, this.sort, this.itemService);
    $(function () {
      $('div.alert').remove();
      $('[contenteditable=true]').focus(function () {
        const val = this.innerHTML;
        const $this = $(this);
        $this.val('');
        setTimeout(function () {
          $this.val(val);
        }, 1);
      });

      const modalConfirm = function (callback) {

        $('#btn-confirm').on('click', function () {
          $('#mi-modal').modal('show');
        });

        $('#modal-btn-si').on('click', function () {
          callback(true);
          $('#mi-modal').modal('hide');
        });

        $('#modal-btn-no').on('click', function () {
          callback(false);
          $('#mi-modal').modal('hide');
        });
      };

      modalConfirm(function (confirm) {
        if (confirm) {
          // Acciones si el usuario confirma
          $('#result').html('CONFIRMADO');
        } else {
          // Acciones si el usuario no confirma
          $('#result').html('NO CONFIRMADO');
        }
      });
    })
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
    const firstToast = this.addToast('wait', 'Updating...');
    this.itemService.updateItems(this.updatedItems)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast('success', 'Posted!');
        console.log(response);
        this.updatedItems = [];
      });
  }

  addToast(toastType: string, message: string) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    toastOptions.title = '';
    toastOptions.msg = message;
    toastOptions.theme = 'bootstrap';
    toastOptions.timeout = 3000;

    switch (toastType) {
      case 'wait':
        toastOptions.timeout = 23000;
        this.toastyService.wait(toastOptions);
        break;
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      default:
        this.toastyService.default(toastOptions);
    }
    return toastId;
  }

  filterItems(filterEl: HTMLInputElement) {
    const term = filterEl.value.replace(/\s+/g, '');
    if (term === '' || term === null || +term === NaN || +term === 0) {
      this.dataSource = new StockDataSource(this.paginator, this.sort, this.itemService);
      return;
    }
    this.itemService.getAllItems()
      .subscribe(res => {
        const fuse = new Fuse(res, this.fuseOptions);
        const result = fuse.search(filterEl.value.toString());
        this.searchResults = result.map(resultItem => {
          let item: IItem = new Item();
          item = <Item>resultItem;
          return item;
        });
        this.dataSource.dataChange.next(this.searchResults);
      });
  }

  removeItems(itemIds: number[]) {
    const firstToast = this.addToast('wait', 'Deleting...');
    let arrNewItems: any[] = [];
    this.itemService.deleteItems(itemIds)
      .subscribe(newItems => {
        arrNewItems = newItems;
        this.dataSource.dataChange.next(newItems);
        this.toastyService.clear(firstToast);
        this.addToast('info', 'Deleted!');
      })
    this.itemsToDelete = [];
  }

  enableEdits() {
    this.isContenteditable = true;
  }

  isConfirmed(eventData) {
    this.showDialog = false;
    if (eventData) {
      this.removeItems(this.itemsToDelete);
      this.headerIsChecked = false;
      this.checkedItems = [];
      return;
    }
  }

  showModal(flag, itemIds?: number[], itemId?: number, ) {
    itemIds.push(itemId);
    this.itemsToDelete = itemIds;
    this.options.body = 'Delete ' + this.itemsToDelete.length.toString() + ' items?';
    this.showDialog = flag;
  }

  deleteMany() {
    const itemIds: number[] = [];
    for (let i = 0; i < this.checkedItems.length; i++) {
      itemIds.push(this.checkedItems[i].itemId);
    }
    this.showModal(true, itemIds);
  }

  toggleAllChecked() {
    this.allChecked = !this.allChecked;
    this.checkAll = !this.checkAll;
    const event = new Event('focus');
    const cBoxes = document.querySelectorAll('.dataCbox');
    this.checkedRowItems = [];

    for (let i = 0; i < cBoxes.length; i++) {
      cBoxes[i].dispatchEvent(event);
      (<HTMLInputElement>cBoxes[i]).checked = this.checkAll;
    }
    this.checkedRowItems.push('end');
    if (this.checkAll) {
      this.checkedItems = this.checkedRowItems.slice();
      this.checkedItems.splice(this.checkedItems.indexOf('end'), 1);
      return;
    }
    this.checkedItems = [];
  }

  toggleSelectedRows(row?, cBoxState?) {
    // item is checked..
    if (cBoxState) {
      // and it's not in our array...
      if (this.checkedItems.indexOf(row.itemId) === -1) {
        // put it there
        this.checkedItems.push(row);
      }
      return;
    }
    // item is unchecked
    // and is in our array...
    const i = this.checkedItems.indexOf(row.itemId)
    if (i) {
      // rm it!
      this.checkedItems.splice(i, 1);
    }
  }

  getAllRows(row) {
    if (this.checkedRowItems.indexOf('end') === -1) {
      this.checkedRowItems.push(row)
    }
  }
}

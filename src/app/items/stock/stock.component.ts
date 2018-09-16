import { Component, OnInit } from '@angular/core';
import { ItemService } from 'app/services/items.service';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  isContenteditable = false;
  updatedItems = [];
  itemsToDelete: number[] = [];

  // configuring np-grid
  data = [{}];
  npGridConfig = {
    columns: [
      {colName: 'itemName', display: 'Item', sort: true, id: true},
      {colName: 'sellingPrice', display: 'Selling Price', sort: true},
      {colName: 'purchaseCost', display: 'Buying Price', sort: true},
      {colName: 'quantity', display: 'Qty'},
      {colName: 'unit', display: 'Units'},
      {colName: 'actions'}
    ],
    additionalColumns: [
      {colName: 'aliases'},
      {colName: 'itemId', noEdit: true}
    ],
    searchBy: ['itemName', 'aliases'],
    pagingOptions: [10, 25, 50, 100],
    multiselect: true
  }

  constructor(
    private itemService: ItemService,
    private toastyService: ToastyService) {}

  ngOnInit() {
    this.itemService.getAllItems()
      .subscribe(res => {
        this.data = res;
      })

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
  onGridAction(eventData) {
    // all incoming updated rows all share the same ids so...
    let itemToUpdate = null;
    for (let i = 0; i < eventData.length; i++) {
      switch (eventData[i].action) {
        case 'update':
        // ...assign the first of them to this variable...
          if (!itemToUpdate) {
            itemToUpdate = eventData[i].row;
          }
          // ...and update this's fields accordingly...
          itemToUpdate[eventData[i].col] = eventData[i].data
          if (i === (eventData.length - 1)) {
            // ...so that i push only a single row to db
            this.updatedItems.push(itemToUpdate);
            this.postUpdate();
          }
          break;
        case 'delete':
          this.itemsToDelete.push(eventData[i].row['itemId'])
          break;
        }
      }
    // because if we put it in the switch block, they get deleted one by one (too many api calls)
    if (this.itemsToDelete.length > 0) {
      this.removeItems(this.itemsToDelete);
    }
    this.updatedItems = [];
  }

  postUpdate() {
    const firstToast = this.addToast('wait', 'Updating...');
    this.itemService.updateItems(this.updatedItems)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast('success', 'Posted!');
        this.updatedItems = [];
      });
  }

  removeItems(itemIds: number[]) {
    const firstToast = this.addToast('wait', 'Deleting...');
    this.itemService.deleteItems(itemIds)
      .subscribe(newItems => {
        this.data = newItems;
        this.addToast('info', 'Deleted!');
        this.toastyService.clear(firstToast);
      })
    this.itemsToDelete = [];
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

  enableEdits() {
    this.isContenteditable = true;
  }
}

import { ItemService } from './../services/items.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionData } from 'app/shared/transacs.model';
import { Item } from 'app/shared/item.model';
import { TransactionService } from 'app/services/transacs.service';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';
import { select } from 'ng2-redux';
import { IAppState } from '../interfaces/appstate.interface';

/**
 * Where transactions (both sale and purchase) are recorded from
 */
@Component({
  selector: 'app-record-transacs',
  templateUrl: './record-transacs.component.html',
  styleUrls: ['./record-transacs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordTransacsComponent implements OnInit {
  data = [{}];
  npGridConfig_sales = {
    columns: [
      {colName: 'itemName', display: 'Item'},
      {colName: 'sellingPrice', display: 'Price'},
      {colName: 'unit', display: 'Units'},
    ],
    searchBy: ['itemName', 'aliases'],
    pagingOptions: [10, 25],
    click: 'click',
    hover: 'hover'
  }
  npGridConfig_purchases = {
    columns: [
      {colName: 'itemName', display: 'Item'},
      {colName: 'purchaseCost', display: 'Buying Price'},
      {colName: 'unit', display: 'Units'},
    ],
    searchBy: ['itemName', 'aliases'],
    pagingOptions: [10, 25],
    click: 'click',
    hover: 'hover'
  }
  receiptRowObjs = {};
  transacType = 'sale';

  // to display errors during user input
  formStatus = { OK: true, text: 'All Good' };
  errorItems = {};

  // displayed on ui after an item is added
  purchaseItems = [];
  saleItems = [];

  // sent to the api
  transaction: TransactionData = new TransactionData();

  // added to transaction which is sent
  itemsArray: Array<Item> = [];

  // other
  allItemsExist: boolean;
  arrJsonNames: Array<string> = [];
  salePurchaseFlag = 0;
  selectedItem: Item;
  selectedDate = this.setDate();

  constructor(private transacService: TransactionService,
    private itemService: ItemService,
    private toastyService: ToastyService) {}

  ngOnInit() {

    $(function () {
      // disabling newline on enter in contenteditable
      const $contentEditables = $('[contentEditable=true]');
      $contentEditables.keypress(function (e) { return e.which !== 13; });
    });
    this.itemService.getItems()
      .subscribe(res => {
        this.data = res;
      })
  }

  onGridAction(actionData) {
    switch (actionData.action) {
      case 'click':
        // if item is on receipt...
        let onReceipt: boolean;
        if (this.transacType === 'sale') {
          for (let i = 0; i < this.saleItems.length; i++) {
            if (this.saleItems[i].itemId === actionData.row.itemId) {
              onReceipt = true;
              // ...increment qty and update amount
              this.saleItems[i].amount = (this.saleItems[i].sellingPrice * ++this.saleItems[i].quantity);
            }
          }
          if (!onReceipt) {
            this.saleItems.push({
              itemId: actionData.row.itemId,
              itemName: actionData.row.itemName,
              quantity: 1,
              sellingPrice: actionData.row.sellingPrice,
              amount: 1 * actionData.row.sellingPrice,
              purchaseCost: actionData.row.purchaseCost,
              unit: 'bla',
              aliases: 'bla'
            });
          }
        } else if (this.transacType === 'purchase') {
            for (let i = 0; i < this.purchaseItems.length; i++) {
              if (this.purchaseItems[i].itemId === actionData.row.itemId) {
                onReceipt = true;
                // ...increment qty and update amount
                this.purchaseItems[i].amount = (this.purchaseItems[i].purchaseCost * ++this.purchaseItems[i].quantity);
              }
            }
            if (!onReceipt) {
              this.purchaseItems.push({
                itemId: actionData.row.itemId,
                itemName: actionData.row.itemName,
                quantity: 1,
                sellingPrice: actionData.row.sellingPrice,
                amount: 1 * actionData.row.sellingPrice,
                purchaseCost: actionData.row.purchaseCost,
                unit: 'bla',
                aliases: 'bla'
              });
            }
        }
        break;
      default:
        console.log('trouble, baby');
        break;
    }
  }

// #region maintaining concurrent values in/from receipt view
  saleItemQtyChanged(saleItemIndex, receiptItem: HTMLInputElement) {
    const $receiptFields = $('[name=sales-receipt] tr td');
    const sp = this.saleItems[saleItemIndex].sellingPrice
    const amt = this.saleItems[saleItemIndex].amount =  sp * +receiptItem.value;
    $receiptFields.eq(3).html(amt.toString());
  }

  saleItemPriceChanged(saleItemIndex, saleItemPriceField: HTMLTableDataCellElement) {
    const currentItem = this.saleItems[saleItemIndex];
    // update amount in view
    if (isNaN(+saleItemPriceField.innerText) || +saleItemPriceField.innerText === 0) {
      // add this item's id to errorItems
      this.errorItems[currentItem.itemId] = 'error'
      this.saleItems[saleItemIndex].amount = 0;
    } else {
      const $receiptFields = $('[name=sales-receipt] tr td');
      // not errored anymore
      delete this.errorItems[currentItem.itemId];
      const amt = this.saleItems[saleItemIndex].amount =  currentItem.quantity * +saleItemPriceField.innerText;
      // force update of td value (since ng change detection doesn't seem to do this smh)
      $receiptFields.eq(3).html(amt.toString());
    }
  }
    // called on field blur to combat the contenteditable 'bug' (check view).
    // This makes sure saleItems(used by angular to update the view)
    // is not updated whilst the user is inputting the field (causing cursor to jump to beginning of contentiditable
    // on each keystroke)
    saleItemPriceFinal(saleItemIndex, saleItemPriceField: HTMLTableDataCellElement) {
      if (isNaN(+saleItemPriceField.innerText)) {
        this.saleItems[saleItemIndex].sellingPrice = 0;
      } else {
        this.saleItems[saleItemIndex].sellingPrice = +saleItemPriceField.innerText;
      }
    }

  saleItemAmtChanged(saleItemIndex, saleItemAmtField: HTMLTableDataCellElement) {
    const currentItem = this.saleItems[saleItemIndex];
    if (isNaN(+saleItemAmtField.innerText) || +saleItemAmtField.innerText === 0) {
      this.errorItems[currentItem.itemId] = 'error';
      this.saleItems[saleItemIndex].sellingPrice = 0;
    } else {
      const $receiptFields = $('[name=sales-receipt] tr td');
      delete this.errorItems[currentItem.itemId];
      const sp = this.saleItems[saleItemIndex].sellingPrice = +saleItemAmtField.innerText / this.saleItems[saleItemIndex].quantity;
      // forcing update
      $receiptFields.eq(2).html(sp.toString());
    }
  }
    saleItemAmtFinal(saleItemIndex, saleItemAmtField: HTMLTableDataCellElement) {
      if (isNaN(+saleItemAmtField.innerText)) {
        this.saleItems[saleItemIndex].amount = 0;
      } else {
        this.saleItems[saleItemIndex].amount = +saleItemAmtField.innerText;
      }
    }

  // the following 5 funtions are clones of the above 5, with 'sale' changed to 'purchase'
  purchaseItemQtyChanged(purchaseItemIndex, receiptItem: HTMLInputElement) {
    const $receiptFields = $('[name=purchases-receipt] tr td');
    const pc = this.purchaseItems[purchaseItemIndex].purchaseCost
    const amt = this.purchaseItems[purchaseItemIndex].amount =  pc * +receiptItem.value;
    $receiptFields.eq(3).html(amt.toString());
  }

  purchaseItemPriceChanged(purchaseItemIndex, purchaseItemPriceField: HTMLTableDataCellElement) {
    const currentItem = this.purchaseItems[purchaseItemIndex];

    if (isNaN(+purchaseItemPriceField.innerText) || +purchaseItemPriceField.innerText === 0) {

      this.errorItems[currentItem.itemId] = 'error'
      this.purchaseItems[purchaseItemIndex].amount = 0;
    } else {
      const $receiptFields = $('[name=purchases-receipt] tr td');

      delete this.errorItems[currentItem.itemId];
      const amt = this.purchaseItems[purchaseItemIndex].amount =  currentItem.quantity * +purchaseItemPriceField.innerText;
      // force update
      $receiptFields.eq(3).html(amt.toString());
    }
  }
    purchaseItemPriceFinal(purchaseItemIndex, purchaseItemPriceField: HTMLTableDataCellElement) {
      if (isNaN(+purchaseItemPriceField.innerText)) {
        this.purchaseItems[purchaseItemIndex].sellingPrice = 0;
      } else {
        this.purchaseItems[purchaseItemIndex].sellingPrice = +purchaseItemPriceField.innerText;
      }
    }

  purchaseItemAmtChanged(purchaseItemIndex, purchaseItemAmtField: HTMLTableDataCellElement) {
    const currentItem = this.purchaseItems[purchaseItemIndex];
    if (isNaN(+purchaseItemAmtField.innerText) || +purchaseItemAmtField.innerText === 0) {
      this.errorItems[currentItem.itemId] = 'error';
      this.purchaseItems[purchaseItemIndex].sellingPrice = 0;
    } else {
      const $receiptFields = $('[name=purchases-receipt] tr td');
      const purchaseItemTotal = +purchaseItemAmtField.innerText;
      const purchaseItemQty = this.purchaseItems[purchaseItemIndex].quantity;

      delete this.errorItems[currentItem.itemId];
      const pc = this.purchaseItems[purchaseItemIndex].sellingPrice = purchaseItemTotal / purchaseItemQty;
      // forcing update
      $receiptFields.eq(2).html(pc.toString());
    }
  }
    purchaseItemAmtFinal(purchaseItemIndex, purchaseItemAmtField: HTMLTableDataCellElement) {
      if (isNaN(+purchaseItemAmtField.innerText)) {
        this.purchaseItems[purchaseItemIndex].amount = 0;
      } else {
        this.purchaseItems[purchaseItemIndex].amount = +purchaseItemAmtField.innerText;
      }
    }
// #endregion

  postSale() {
    this.validateItems(this.transacType);

    if (this.transaction.items) {
      this.transaction.date = this.selectedDate;
      this.transaction.transactionType = 1;

      const firstToast = this.addToast('wait', 'posting');
      this.transacService.postTransacs(this.transaction)
        .subscribe(response => {
          this.toastyService.clear(firstToast);
          this.addToast('success', 'Posted!');
        }, err => {
          this.toastyService.clear(firstToast);
        });

      // clear all posted sales from display
      this.saleItems = [];
    }
  }
  postPurchase() {
    this.validateItems(this.transacType);

    if (this.transaction.items) {
      this.transaction.date = this.selectedDate;
      this.transaction.transactionType = 2;

      const firstToast = this.addToast('wait', 'posting..');
      this.transacService.postTransacs(this.transaction)
        .subscribe(response => {
          this.toastyService.clear(firstToast);
          this.addToast('success', 'Posted!');
        });

      // clear all posted purchases from display
      this.purchaseItems = [];
    }
  }


  getTotalSaleAmount() {
    let total = 0;
    for (let i = 0; i < this.saleItems.length; i++) {
      total += this.saleItems[i].amount;
    }
    return total;
  }
  getTotalPurchaseAmount() {
    let total = 0;
    for (let i = 0; i < this.purchaseItems.length; i++) {
      total += this.purchaseItems[i].amount;
    }
    return total;
  }

  removeSaleItem(x) {
    this.saleItems.splice(x, 1);
  }
  removePurchaseItem(x) {
    this.purchaseItems.splice(x, 1);
  }

  validateItems(transacType: string) {
    if (!jQuery.isEmptyObject(this.errorItems)) {
      this.addToast('error', 'some items have 0 amount');
      return;
    }
    switch (transacType) {
      case 'sale':
        if (this.purchaseItems.length > 0) {
          this.addToast('error', 'Post purchases first!')
          return;
        }
        if (this.saleItems.length > 0) {
          this.stageItemsForPosting(transacType);
        }
        break;
      case 'purchase':
        if (this.saleItems.length > 0) {
          this.addToast('error', 'Post sales first!')
          return;
        }
        if (this.purchaseItems.length > 0) {
          this.stageItemsForPosting(transacType);
        }
        break;
      default:
        this.addToast('error', 'Invalid transactionType!');
        return;
    }
  }

  stageItemsForPosting(transactionType: string) {
    switch (transactionType) {
      case 'sale':
        this.transaction.items = this.saleItems;
        break;
      case 'purchase':
        this.transaction.items = this.purchaseItems;
        break;
      default:
        console.log('invalid transaction type');
        break;
    }
  }

  ///
  /// OTHER
  ///
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

  getTotalItems(tType) {
    if (tType === 'sale') {
      return this.saleItems.length;
    } else if (tType === 'purch') {
      return this.purchaseItems.length;
    } else {
      return 0;
    }
  }

  clearReceipt() {
    switch (this.transacType) {
      case 'sale':
        this.saleItems = [];
        break;
      case 'purchase':
        this.purchaseItems = []
        break;
      default:
        console.log('invalid transaction type');
        break;
    }
  }

  setDate() {
    const currentDate = new Date().toISOString().substr(0, 10);
    return currentDate;
  }

  changeTransacType(transacType: string) {
    this.transacType = transacType;
  }
}

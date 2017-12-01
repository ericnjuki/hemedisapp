import { ItemService } from './../services/items.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import { TransactionData } from 'app/shared/transacs.model';
import { Item } from 'app/shared/item.model';
import { TransactionService } from 'app/services/transacs.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

/**
 * Where transactions (both sale and purchase) are recorded from
 * Has autocomplete, shall not allow recording transaction of
 * an item that doesn't exist!
 */
@Component({
  selector: 'app-record-transacs',
  templateUrl: './record-transacs.component.html',
  styleUrls: ['./record-transacs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordTransacsComponent implements OnInit {
  // displayed on ui after a suggested item is clicked
  suggestedItem = {
    sellingPrice: ''
  };

  // displayed on ui after an item is added
  purchaseItems = [];
  saleItems = [];

  // sent to the api
  transaction: ITransactionData = new TransactionData();

  // added to transaction which is sent
  itemsArray: Array<Item> = [];

  // other
  allItemsExist: boolean;
  arrJsonNames: Array<string> = [];

  constructor(private transacService: TransactionService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private itemService: ItemService) { }

  ngOnInit() {

    $(function () {

      // setting focus on contenteditable <td>s on loading a tab, for visibility
      setTimeout(() => {
        $('[name=record-sales] tfoot tr').children('td').eq(0).focus();
      }, 0);

      $('[href="#sale"]').on('click', () => {
        setTimeout(() => {
          $('[name=record-sales] tfoot tr').children('td').eq(0).focus();
        }, 0);
      });
      $('[href="#purchase"]').on('click', () => {
        setTimeout(() => {
          $('[name=record-purchases] tfoot tr').children('td').eq(0).focus();
        }, 0);
      });
      // highlights all text on 'Item' fields on focus
      $('[data-text=Item]').on('focus', () => {
        document.execCommand('selectAll', false, null);
      });
    });
  }

  validateItem(transacType) {
    const toastOptions: ToastOptions = {
      title: '',
      msg: 'Item not added',
      timeout: 5000,
    };
    let $itemData;
    switch (transacType) {
      case 'sale':
        $itemData = $('[name=record-sales] tfoot tr').eq(0).children('td');
        break;
      case 'purchase':
        $itemData = $('[name=record-purchases] tfoot tr').eq(0).children('td');
        break;
      default:
        this.validationFailed('Invalid transactionType!');
        return;
    }

    const itemName = $itemData.eq(0).html();
    const itemUnit = 'pc';
    const itemQuantity = +$itemData.eq(1).html().replace(/\s+/g, '');
    const itemPrice = +$itemData.eq(2).html().replace(/\s+/g, '');

    if (
      itemName === '' || itemName === null ||
      +itemQuantity === NaN ||
      +itemPrice === NaN || +itemPrice === 0
    ) {
      this.validationFailed('All fields must be filled!', 'error');
      return;
    }

    if (!this.checkIfNumber($itemData.eq(1))) {
      $itemData.eq(1).addClass('error-field');
      this.validationFailed('Quantity must be a number!', 'error');
      return;
    }

    if (!this.checkIfNumber($itemData.eq(2))) {
      $itemData.eq(2).addClass('error-field');
      this.validationFailed('Price must be a number!', 'error');
      return;
    }

    this.transaction.date = this.setDate();

    const checkNamesToast = this.addToast('wait', 'Validating...');
    this.itemService.searchItems().subscribe(jsonNames => {
      this.arrJsonNames = jsonNames;
      for (let i = 0; i < this.arrJsonNames.length; i++) {
        if (this.arrJsonNames[i].toUpperCase() === itemName.toUpperCase()) {
          this.allItemsExist = true;
        }
      }
      if (!this.allItemsExist) {
        this.toastyService.clear(checkNamesToast);
        this.validationFailed('Item doesn\'t exist in your records!', 'error');
        $itemData.eq(0).focus();
        return;
      } else {
        this.itemsArray.push({
          itemName: itemName,
          unit: itemUnit,
          quantity: itemQuantity,
          purchaseCost: 0,
          sellingPrice: itemPrice
        });
        this.toastyService.clear(checkNamesToast);
        this.transaction.items = this.itemsArray;

        if (transacType === 'sale') {
          this.saleItems.push({
            item: itemName,
            unit: itemUnit,
            quantity: itemQuantity,
            price: itemPrice,
            amount: itemQuantity * itemPrice
          });
          this.transaction.transactionType = 1;
          $itemData.not($('[name=record-sales] tfoot tr td#addButton')).html('');
        }
        if (transacType === 'purchase') {
          this.purchaseItems.push({
            item: itemName,
            unit: itemUnit,
            quantity: itemQuantity,
            price: itemPrice,
            amount: itemQuantity * itemPrice
          });
          this.transaction.transactionType = 2;
          $itemData.not($('[name=record-purchases] tfoot tr td#addButton')).html('');
        }
      }
    });
    $itemData.eq(1).removeClass('error-field');
    $itemData.eq(2).removeClass('error-field');
  }

  // addSaleItem() {
  //   // bad: jquery
  //   const $itemData = $('[name=record-sales] tfoot tr').eq(0).children('td');
  //   const saleItemName = $itemData.eq(0).html();
  //   const itemUnit = 'pc';
  //   const itemQuantity = +$itemData.eq(1).html().replace(/\s+/g, '');
  //   const itemSellingPrice = +$itemData.eq(2).html().replace(/\s+/g, '');

  //   this.saleItems.push({
  //     item: saleItemName,
  //     unit: itemUnit,
  //     quantity: itemQuantity,
  //     price: itemSellingPrice,
  //     amount: itemQuantity * itemSellingPrice
  //   });

  //   this.itemsArray.push({
  //     itemName: saleItemName,
  //     unit: itemUnit,
  //     quantity: itemQuantity,
  //     purchaseCost: 0,
  //     sellingPrice: itemSellingPrice
  //   });

  //   this.transaction = {
  //     date: this.setDate(),
  //     items: this.itemsArray,
  //     transactionType: 1
  //   };
  //   $itemData.not($('[name=record-sales] tfoot tr td#addButton')).html('');

  // }

  removeSaleItem(x) {
    this.saleItems.splice(x, 1);
  }

  getTotalSaleAmount() {
    let total = 0;
    for (let i = 0; i < this.saleItems.length; i++) {
      total += this.saleItems[i].amount;
    }
    return total;
  }

  postSale() {
    const firstToast = this.addToast('wait');
    this.transacService.postTransacs(this.transaction)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast();
        console.log(response);
      });

    // clear all posted sales from display
    this.saleItems = [];
    // clear items in temp array
    this.itemsArray = [];
  }

  // addPurchaseItem() {
  //   const $itemData = $('[name=record-purchases] tfoot tr').eq(0).children('td');
  //   const purchaseItemName = $itemData.eq(0).html();
  //   const itemUnit = 'pc';
  //   const itemQuantity = +$itemData.eq(1).html().replace(/\s+/g, '');
  //   const itemPurchaseCost = +$itemData.eq(2).html().replace(/\s+/g, '');

  //   this.purchaseItems.push({
  //     item: purchaseItemName,
  //     unit: itemUnit,
  //     quantity: itemQuantity,
  //     price: itemPurchaseCost,
  //     amount: itemQuantity * itemPurchaseCost
  //   });

  //   this.itemsArray.push({
  //     itemName: purchaseItemName,
  //     unit: itemUnit,
  //     quantity: itemQuantity,
  //     purchaseCost: itemPurchaseCost,
  //     sellingPrice: 0
  //   });

  //   this.transaction = {
  //     date: this.setDate(),
  //     items: this.itemsArray,
  //     transactionType: 2
  //   };
  //   $itemData.not($('[name=record-purchases] tfoot tr td#addButton')).html('');
  // }

  removePurchaseItem(x) {
    this.purchaseItems.splice(x, 1);
  }

  getTotalPurchaseAmount() {
    let total = 0;
    for (let i = 0; i < this.purchaseItems.length; i++) {
      total += this.purchaseItems[i].amount;
    }
    return total;
  }

  postPurchase() {
    const firstToast = this.addToast('wait');
    this.transacService.postTransacs(this.transaction)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast();
        console.log(response);
      });

    // clear all posted purchases from display
    this.purchaseItems = [];
    // clear items in temp array
    this.itemsArray = [];
  }



  ///
  /// OTHER
  ///
  addToast(toastType?, message?) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      msg: 'posting...',
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    if (toastType === 'wait') {
      toastOptions.msg = message;
      this.toastyService.wait(toastOptions);
    } else {
      toastOptions.msg = 'Posted!';
      toastOptions.timeout = 3000;
      this.toastyService.success(toastOptions);
    }
    return toastId;
  }

  setDate() {
    const currentDate = new Date().toISOString().substr(0, 10);
    return currentDate;
  }

  updateDate(newDate: HTMLInputElement) {
    this.transaction.date = newDate.value;
  }

  getTotalSaleAmountOnItem() {
    $('[name=record-sales] tfoot tr td ').eq(3)
      .html(
      (+$('[name=record-sales] [data-text=Qty]').html() * +$('[name=record-sales] [data-text=Price]').html()).toString()
      );
  }

  getTotalPurchaseAmountOnItem() {
    $('[name=record-purchases] tfoot tr td ').eq(3)
      .html(
      (+$('[name=record-purchases] [data-text=Qty]').html() * +$('[name=record-purchases] [data-text=Price]').html()).toString()
      );
  }

  handleItemData(itemObject) {
    $('[data-text=Price]').html(itemObject.sellingPrice);
  }

  validationFailed(message: string, popupType?) {
    const toastOptions: ToastOptions = {
      title: '',
      msg: message,
      timeout: 3000,
    };
    if (popupType === 'error') {
      this.toastyService.error(toastOptions);
      return;
    }
    console.log(message);
    return;
  }

  checkIfNumber(qtyElement: HTMLInputElement, field?) {
    const $qtyElement = $(qtyElement);
    if (!this.isNumber($qtyElement.html().replace(/\s+/g, ''))) {
      this.validationFailed('Field must be a number!');
      return false;
    }

    if (field === 'sqty') {
      this.getTotalSaleAmountOnItem();
    }

    if (field === 'pqty') {
      this.getTotalPurchaseAmountOnItem();
    }
    return true;
  }

  isNumber(value): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}

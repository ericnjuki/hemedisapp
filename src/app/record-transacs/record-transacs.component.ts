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
  // to display errors during user input
  formStatus = { OK: true, text: 'All Good' };

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
  salePurchaseFlag = 0;
  selectedItem: Item;
  selectedDate = this.setDate();

  constructor(private transacService: TransactionService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private itemService: ItemService) { }

  ngOnInit() {

    $(function () {

      // setting focus on contenteditable <td>s on loading a tab, for visibility
      setTimeout(() => {
        $('[name=record-sales] tfoot tr').eq(1).children('td').eq(0).focus();
      }, 0);

      $('[href="#sale"]').on('click', () => {
        setTimeout(() => {
          $('[name=record-sales] tfoot tr').eq(1).children('td').eq(0).focus();
        }, 0);
      });
      $('[href="#purchase"]').on('click', () => {
        setTimeout(() => {
          $('[name=record-purchases] tfoot tr').eq(1).children('td').eq(0).focus();
        }, 0);
      });
      // disabling newline on enter in contenteditable
      const $contentEditables = $('[contentEditable=true]');
      $contentEditables.keypress(function (e) { return e.which !== 13; });

    });
  }

  // called from template, when add item button is clicked
  validateItem(transacType) {
    // this flag verifies that all items input exist in remote
    this.allItemsExist = false;
    const toastOptions: ToastOptions = {
      title: '',
      msg: 'Item not added',
      timeout: 5000,
    };
    // getting input from template
    let $itemData;
    switch (transacType) {
      case 'sale':
        if (this.salePurchaseFlag === 1 && this.purchaseItems.length > 0) {
          this.validationFailed('error', 'Post purchases first!')
          return;
        }
        $itemData = $('[name=record-sales] tfoot tr').eq(1).children('td');
        this.salePurchaseFlag = 0;
        break;
      case 'purchase':
        if (this.salePurchaseFlag === 0 && this.saleItems.length > 0) {
          this.validationFailed('error', 'Post sales first!')
          return;
        }
        $itemData = $('[name=record-purchases] tfoot tr').eq(1).children('td');
        this.salePurchaseFlag = 1;
        break;
      default:
        this.validationFailed('error', 'Invalid transactionType!');
        return;
    }

    const itemName = $itemData.eq(0).html();
    const itemUnit = 'pc';
    const itemQuantity = +$itemData.eq(1).html().replace(/\s+/g, '');
    const itemPrice = +$itemData.eq(2).html().replace(/\s+/g, '');

    // don't do this again: verifying empty fields
    if (
      itemName === '' || itemName === null ||
      +itemQuantity === NaN ||
      +itemPrice === NaN || +itemPrice === 0
    ) {
      this.validationFailed('error', 'All fields must be filled!');
      return;
    }

    if (!this.checkIfNumber($itemData.eq(1))) {
      $itemData.eq(1).addClass('error-field');
      this.validationFailed('error', 'Quantity must be a number!');
      return;
    }

    if (!this.checkIfNumber($itemData.eq(2))) {
      $itemData.eq(2).addClass('error-field');
      this.validationFailed('error', 'Price must be a number!');
      return;
    }

    this.transaction.date = this.selectedDate;

    this.itemService.getItemNames().subscribe(jsonNames => {
      this.arrJsonNames = jsonNames;
      if (this.arrJsonNames.length === 0) {
        this.validationFailed('error', 'Inventory has no records (temp error)');
        $itemData.eq(0).focus();
        return;
      }
      let i = 0;
      while (!this.allItemsExist) {
        if (this.arrJsonNames[i].toUpperCase() === itemName.toUpperCase()) {
          this.allItemsExist = true;
        } else if (i === this.arrJsonNames.length - 1) {
          this.validationFailed('error', 'Item doesn\'t exist in your records!');
          $itemData.eq(0).focus();
          // highlights all text on 'Item' fields on focus
          document.execCommand('selectAll', false, null);
          return;
        }
        i++;
      }
      // input item exists in records and all fields good


      if (transacType === 'sale') {
        this.itemsArray.push({
          itemId: this.selectedItem.itemId,
          itemName: itemName,
          unit: itemUnit,
          quantity: itemQuantity,
          purchaseCost: 0,
          sellingPrice: itemPrice
        });
        this.transaction.items = this.itemsArray;
        this.saleItems.push({
          item: itemName,
          unit: itemUnit,
          quantity: itemQuantity,
          price: itemPrice,
          amount: itemQuantity * itemPrice
        });
        this.transaction.transactionType = 1;
      }

      if (transacType === 'purchase') {
        this.itemsArray.push({
          itemId: this.selectedItem.itemId,
          itemName: itemName,
          unit: itemUnit,
          quantity: itemQuantity,
          purchaseCost: itemPrice,
          sellingPrice: 0
        });
        this.transaction.items = this.itemsArray;
        this.purchaseItems.push({
          item: itemName,
          unit: itemUnit,
          quantity: itemQuantity,
          price: itemPrice,
          amount: itemQuantity * itemPrice
        });
        this.transaction.transactionType = 2;
      }
    });
    $itemData.not($('td#addButton')).html('');
    $itemData.eq(0).focus();
    $itemData.eq(1).removeClass('error-field');
    $itemData.eq(2).removeClass('error-field');
  }

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
    this.transaction.date = this.selectedDate;
    const firstToast = this.addToast('wait', 'posting');
    this.transacService.postTransacs(this.transaction)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast('success', 'Posted!');
        console.log(response);
      });

    // clear all posted sales from display
    this.saleItems = [];
    // clear items in temp array
    this.itemsArray = [];
  }

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
    this.transaction.date = this.selectedDate;
    const firstToast = this.addToast('wait', 'posting..');
    this.transacService.postTransacs(this.transaction)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast('success', 'Posted!');
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

  setDate() {
    const currentDate = new Date().toISOString().substr(0, 10);
    return currentDate;
  }

  getTotalSaleAmountOnItem() {
    $('[name=record-sales] tfoot tr ').eq(1).children().eq(3)
      .html(
      (+$('[name=record-sales] [data-text=Qty]').html() * +$('[name=record-sales] [data-text=Price]').html()).toString()
      );
  }

  getTotalPurchaseAmountOnItem() {
    $('[name=record-purchases] tfoot tr ').eq(1).children().eq(3)
      .html(
      (+$('[name=record-purchases] [data-text=Qty]').html() * +$('[name=record-purchases] [data-text=Price]').html()).toString()
      );
  }

  handleItemData(itemObject) {
    const $bla = $('li.active a[data-toggle=tab]');
    this.selectedItem = itemObject;
    if ($bla.html().toUpperCase() === 'SALE') {
      $('[data-text=Price]').html(itemObject.sellingPrice);

    } else {
      $('[data-text=Price]').html(itemObject.purchaseCost);

    }

  }

  clickAddButton(transacType) {
    // simulates a click.
    // i'm using this to add a new row to array of 'items to be added'
    // when the enter_key is clicked from anywhere within the row that's
    // currently being edited
    this.validateItem(transacType);
    // document.getElementById('addisiaButton').click();
  }

  getTotalItems() {
    return this.itemsArray.length;
  }

  validationFailed(popupType, message: string) {
    const toastOptions: ToastOptions = {
      title: '',
      msg: message,
      timeout: 3000,
    };

    switch (popupType) {
      case 'error':
        this.toastyService.error(toastOptions);
        return;
      case 'warning':
        this.formStatus.OK = false;
        this.formStatus.text = message;
        break;
    }
    return;
  }

  checkIfNumber(qtyElement: HTMLInputElement, field?) {
    const $qtyElement = $(qtyElement);
    if (!this.isNumber($qtyElement.html().replace(/\s+/g, ''))) {
      this.validationFailed('warning', 'Field must be a number!');
      return false;
    }
    this.formStatus.OK = true;
    this.formStatus.text = 'All Good';
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

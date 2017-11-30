import { Item } from 'app/shared/item.model';
import { ItemService } from './../services/items.service';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'app/services/transacs.service';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

/**
 * Where all new/unique items are added from, has no autocomplete
 */
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  // array of items that are displayed so the user can see
  // what items they're going to post
  items = [];

  constructor(private itemService: ItemService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private transacService: TransactionService) { }

  ngOnInit() {
    $(function () {
      const $contentEditables = $('[contentEditable=true]');
      // focus on the first contenteditable field when this component is created
      setTimeout(() => {
        $('table tfoot tr td').eq(0).focus();
      }, 0);
      // disables enter_key's action of adding a line-break in a contenteditable
      // as i've subscribed to the enter onclick event, setting it's action to
      // add a new row in the ADD ITEMS table
      $contentEditables.keypress(function (e) { return e.which !== 13; });
    });
  }

  addItem() {
    if (this.checkIfEmpty) {
      const toastOptions: ToastOptions = {
        title: '',
        msg: 'Item not added',
        timeout: 5000,
      };
      this.toastyService.error(toastOptions);
      return;
    }
    const $itemData = $('[name=record-items] tfoot tr').eq(0).children('td');
    const itemName = $itemData.eq(0).html();
    const unit = $itemData.eq(1).html();
    // .replace(regex) to remove all spaces from the value of the td;
    // fixed a bug where the value entered had a space character before it
    const quantity = +$itemData.eq(2).html().replace(/\s+/g, '');
    const purchaseCost = +$itemData.eq(3).html().replace(/\s+/g, '');
    const sellingPrice = +$itemData.eq(4).html().replace(/\s+/g, '');

    const item = {
      itemName: itemName,
      unit: unit,
      quantity: quantity,
      purchaseCost: purchaseCost,
      sellingPrice: sellingPrice
    };
    this.items.push(item);
    // clears row of contenteditable tds after its values are added to the
    // array of items above
    $itemData.not($('[name=record-items] tfoot tr td#addButton')).html('');
    // and focus on the first contenteditable again
    $itemData.eq(0).focus();
  }

  removeItem(x) {
    this.items.splice(x, 1);
  }

  postItems() {
    const firstToast = this.addToast('wait');
    this.itemService.addItems(this.items)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.addToast();
        console.log(response);
        // if adding new items was successful, add
        // new record of them as purchases
        let purchaseTransaction: ITransactionData;
        purchaseTransaction = {
          date: new Date().toISOString().substr(0, 10),
          items: this.items,
          transactionType: 2
        }
        this.transacService.postTransacs(purchaseTransaction)
          .subscribe(res => {
            console.log(res);
            // clear all items from display; shows the user that items have been posted.
            this.items = [];
          });
      });
    const $itemData = $('[name=record-items] tfoot tr').eq(0).children('td');
    $itemData.eq(0).focus();
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

  clickAddButton() {
    // simulates a click.
    // i'm using this to add a new row to array of 'items to be added'
    // when the enter_key is clicked from anywhere within the row that's
    // currently being edited
    document.getElementById('addisiaButton').click();
  }

  getNumberOfItems() {
    // using this to show the number of items that are going to be
    // posted in the add button
    return this.items.length;
  }

  validationError(msg: string, type?: string) {
    console.log(type + ': ' + msg);
  }

  checkIfEmpty(element: HTMLInputElement) {
    if (
      +element.innerHTML === NaN ||
      element.innerHTML === null ||
      +element.innerHTML === 0 ||
      element.innerHTML === ''
    ) {
      $(element).addClass('error-field');
      this.validationError('Required field!');
      return true;
    }
    return false
  }

  checkIfNumber(element: HTMLInputElement) {
    if (!this.isNumber(element.innerHTML)) {
      this.validationError('Field must be a number!');
      return;
    }
    console.log('is good');
  }

  checkIfHasNumber(element: HTMLInputElement) {
    if (this.hasNUmber(element.innerHTML)) {
      this.validationError('This is a unit, are you sure you want numbers in it?', 'warning');
    }
  }

  isNumber(value): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  hasNUmber(value): boolean {
    return /\d/.test(value);
  }
}

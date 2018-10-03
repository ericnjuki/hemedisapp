import { Item } from 'app/shared/item.model';
import { ItemService } from './../services/items.service';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'app/services/transacs.service';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import {
  ToastyService,
  ToastyConfig,
  ToastOptions,
  ToastData
} from 'ng2-toasty';
import { select } from 'ng2-redux';
import { IAppState } from '../interfaces/appstate.interface';

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
  itemsForRecord = [];

  somethingIsEmpty = true;

  // to display errors during user input
  formStatus = { OK: true, text: 'All Good' };

  @select((s: IAppState) => s.stockItems)
  stateStockItems;

  constructor(
    private itemService: ItemService,
    private toastyService: ToastyService
  ) {}

  ngOnInit() {
    $(function() {
      const $contentEditables = $('[contentEditable=true]');
      // focus on the first contenteditable field when this component is created
      setTimeout(() => {
        $contentEditables.eq(0).focus();
      }, 0);
      // disables enter_key's action of adding a line-break in a contenteditable
      // as i've subscribed to the enter onclick event, setting it's action to
      // add a new row in the ADD ITEMS table
      $contentEditables.keypress(function(e) {
        return e.which !== 13;
      });
    });
  }

  addItem() {
    const toastOptions: ToastOptions = {
      title: '',
      msg: 'Fill in the fields please',
      timeout: 5000
    };
    const $itemData = $('[name=record-items] thead tr')
      .eq(2)
      .children('td');

    for (let i = 0; i <= 2; i++) {
      const $el = $itemData.eq(i);
      if (i === 0) {
        if (!this.isValidInput($el, 'string')) {
          return;
        }
        continue;
      }
      if (!this.isValidInput($el, 'number') || !this.isNumber($el)) {
        return;
      }
    }

    if (this.somethingIsEmpty) {
      toastOptions.msg = 'Something is empty';
      this.toastyService.error(toastOptions);
      return;
    }
    const itemName = $itemData.eq(0).html();
    let unit;
    // .replace(regex) to remove all spaces from the value of the td;
    // fixed a bug where the value entered had a space character before it
    const purchaseCost = +$itemData
      .eq(1)
      .html()
      .replace(/\s+/g, '');
    const sellingPrice = +$itemData
      .eq(2)
      .html()
      .replace(/\s+/g, '');
    let quantity;

    const $QtyEl = $itemData.eq(3);
    if (!this.isEmpty($QtyEl, 'number') && !this.isNumber($QtyEl)) {
      toastOptions.msg = 'Quantity must be a number';
      this.toastyService.error(toastOptions);
      return;
    } else if (this.isEmpty($QtyEl, 'number')) {
      quantity = 0;
    } else {
      quantity = +$itemData
        .eq(3)
        .html()
        .replace(/\s+/g, '');
    }
    const $UnitEl = $itemData.eq(4);
    if (this.isEmpty($UnitEl, 'string')) {
      unit = 'pc';
    } else if (this.hasNUmber($UnitEl)) {
      toastOptions.msg = 'Item unit has a number in it...';
      this.toastyService.warning(toastOptions);
      unit = $itemData.eq(4).html();
    } else {
      unit = $itemData.eq(4).html();
    }

    const itemForRecord = {
      itemName: itemName,
      unit: unit,
      quantity: quantity,
      purchaseCost: purchaseCost,
      sellingPrice: sellingPrice
    };
    this.itemsForRecord.unshift(itemForRecord);
    // clears row of contenteditable tds after its values are added to the
    // array of items above
    $itemData.not($('td#addButton')).html('');
    // and focus on the first contenteditable again
    $itemData.eq(0).focus();
  }

  removeItem(x) {
    this.itemsForRecord.splice(x, 1);
  }

  postItems() {
    const firstToast = this.addToast('wait...');

    // manually setting ids of elements since we don't have a db to auto-assign them
    let lastItemId = 0;
    this.stateStockItems.subscribe(theItems => {
      lastItemId = theItems.length;
    });
    for (let i = 0; i < this.itemsForRecord.length; i++) {
      this.itemsForRecord[i].itemId = lastItemId++;
    }

    this.itemService.addItems(this.itemsForRecord)
      .subscribe(response => {
        this.toastyService.clear(firstToast);
        this.itemsForRecord = [];
      });
    const $itemData = $('[name=record-items] thead tr')
      .eq(2)
      .children('td');
    $itemData.eq(0).focus();
  }

  addToast(toastType?) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        toastId = toast.id;
      }
    };
    if (toastType === 'wait') {
      toastOptions.timeout = 230000;
      toastOptions.msg = 'adding...';
      this.toastyService.wait(toastOptions);
    } else {
      toastOptions.msg = 'Item added successfully!';
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
    return this.itemsForRecord.length;
  }

  validationError(msg: string) {
    this.formStatus.OK = false;
    this.formStatus.text = msg;
  }

  isEmpty($element: JQuery<HTMLElement>, type) {
    if (
      type === 'number' &&
      +$element.html().replace(/\s+/g, '') === NaN
      // || +$element.html().replace(/\s+/g, '') === 0
    ) {
      return true;
    }
    if (
      (type === 'string' && $element.html().replace(/\s+/g, '') === null) ||
      $element.html().replace(/\s+/g, '') === ''
    ) {
      return true;
    }
    return false;
  }

  isValidInput($element: JQuery<HTMLElement>, type) {
    this.somethingIsEmpty = this.isEmpty($element, type);
    if (this.somethingIsEmpty) {
      this.formStatus.OK = false;
      this.formStatus.text = 'Fill in required fields!';
      $element.addClass('error-field');
      return false;
    }
    this.clearError($element);
    return true;
  }

  clearError($element?) {
    this.formStatus.OK = true;
    this.formStatus.text = 'All Good';
    if ($element !== undefined) {
      $element = $($element);
      $element.removeClass('error-field');
    }
  }
  isNumber($element?) {
    $element = $($element);
    if (!this.isNumeric($element.html())) {
      this.validationError('Field must be a number!');
      return false;
    }
    return true;
  }

  checkIfHasNumber(element: HTMLInputElement) {
    if (this.hasNUmber(element.innerHTML)) {
      this.validationError(
        'This is a unit, are you sure you want numbers in it?'
      );
    }
  }

  isNumeric(value): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  hasNUmber(value): boolean {
    return /\d/.test(value);
  }
}

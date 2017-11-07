import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import { TransactionData } from 'app/shared/transacs.model';
import { Item } from 'app/shared/item.model';
import { TransactionService } from 'app/services/transacs.service';

@Component({
  selector: 'app-record-transacs',
  templateUrl: './record-transacs.component.html',
  styleUrls: ['./record-transacs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordTransacsComponent implements OnInit {
  // local variables
  purchaseItems = [];
  saleItems = [];
  stockItemsFromDb = ['ade', 'allan', 'aeon'];
  // transactionObject
  transaction: ITransactionData;
  itemsArray: Array<Item> = [];

  constructor(private transacService: TransactionService) {
   }

  ngOnInit() {

    $(function () {

      // var availableTags: Array<string> = this.getItems();
      var availableTags = ['eric', 'erric', 'rickest'];
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
      // (<any>$('[contenteditable=true]')).autocomplete({
      //   source: availableTags,
      //   minLength: 2
      // });
    });
  }
  getItems() {
    return ['ade', 'allan', 'aeon'];
  }

  ///
  ///SALES
  ///
  addSaleItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    console.log();
    // item.parentElement.parentElement.parentElement
    const itemData = $('[name=record-sales] tfoot tr').eq(0).children('td');
    const saleItemName = itemData.eq(0).html().replace(/\s+/g, '');
    const itemQuantity = +itemData.eq(1).html().replace(/\s+/g, '');
    const itemSellingPrice = +itemData.eq(2).html().replace(/\s+/g, '');

    this.saleItems.push({
      item: saleItemName,
      quantity: itemQuantity,
      price: itemSellingPrice,
      amount: itemQuantity * itemSellingPrice
    });

    this.itemsArray.push({
      itemName: saleItemName,
      quantity: itemQuantity,
      purchaseCost: 0,
      sellingPrice: itemSellingPrice
    });

    this.transaction = {
      date: new Date().toString(),
      items: this.itemsArray,
      transactionType: 1
    };
    itemData.not($('[name=record-sales] tfoot tr td#addButton')).html('');
    console.log(this.saleItems);

  }

  removeSaleItem(x) {
    this.saleItems.splice(x, 1);
    console.log(this.saleItems);
  }

  getTotalSaleAmount() {
    let total = 0;
    // TO DO: efficientify this psst: use for..in
    for (let i = 0; i < this.saleItems.length; i++) {
      total += this.saleItems[i].amount;
    }
    return total;
  }

  postSale() {
    console.log('sale posted');
    // this.transacService.postTransacs(this.transaction).subscribe(response => {
    //   console.log(response);
    // });

  }


  ///
  /// PURCHASES
  ///
  addPurchaseItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    const itemData = $('[name=record-purchases] tfoot tr').eq(0).children('td');
    const purcahseItemName = itemData.eq(0).html().replace(/\s+/g, '');
    const itemPurchaseCost = +itemData.eq(1).html().replace(/\s+/g, '');
    const itemQuantity = +itemData.eq(2).html().replace(/\s+/g, '');

    this.purchaseItems.push({
      item: purcahseItemName,
      quantity: itemQuantity,
      price: itemPurchaseCost,
      amount: itemQuantity * itemPurchaseCost
    });

    this.itemsArray.push({
      itemName: purcahseItemName,
      quantity: itemQuantity,
      purchaseCost: itemPurchaseCost,
      sellingPrice: 0
    });

    this.transaction = {
      date: new Date().toISOString(),
      items: this.itemsArray,
      transactionType: 0
    };
    itemData.not($('[name=record-purchases] tfoot tr td#addButton')).html('');
    console.log(this.purchaseItems);
  }
  removePurchaseItem(x) {
    this.purchaseItems.splice(x, 1);
    console.log(this.purchaseItems);

  }
  getTotalPurchaseAmount() {
    let total = 0;
    for (let i = 0; i < this.purchaseItems.length; i++) {
      total += this.purchaseItems[i].amount;
    }
    return total;

  }
  postPurchase() {
    // this.transacService.postTransacs(this.transaction).subscribe(response => {
    //   console.log(response);
    // });
    console.log('purchase posted');
  }



  ///
  ///OTHER
  ///

  setDate() {
    return new Date().toDateString();
  }
  changeDate() {

  }
}

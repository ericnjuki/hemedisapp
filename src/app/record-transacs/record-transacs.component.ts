import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ITransactionData } from "app/interfaces/transacs.interface";
import { TransactionData } from "app/shared/transacs.model";
import { Item } from "app/shared/item.model";
import { TransactionService } from "app/services/transacs.service";

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
  // transactionObject
  transaction: ITransactionData;
  itemsArray: Array<Item> = [];

  constructor(private transacService: TransactionService) { }

  ngOnInit() {

    $(function () {
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
    });
  }

  ///
  ///SALES
  ///
  addSaleItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    // item.parentElement.parentElement.parentElement
    const itemData = $('[name=record-sales] tfoot tr').eq(0).children('td');
    const saleItemName = itemData.html().replace(/\s+/g, '');
    const itemSellingPrice = +itemData.eq(1).html().replace(/\s+/g, '');
    const itemQuantity = +itemData.eq(2).html().replace(/\s+/g, '');

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
        date: '2019-04-23 18:25:43.000',
        items: this.itemsArray,
        transactionType: 1
      };
    itemData.not($('[name=record-sales] tfoot tr td#addButton')).html('');
  }
  removeSaleItem(x) {
    this.saleItems.splice(x, 1);
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
    this.transacService.postTransacs(this.transaction).subscribe(response => {
      console.log(response);
    });

  }


  ///
  /// PURCHASES
  ///
  addPurchaseItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    // item.parentElement.parentElement.parentElement
    console.log(item.parentElement.parentElement.parentElement);
    const itemData = $('[name=record-purchases] tfoot tr').eq(0).children('td');
    const purcahseItemName = itemData.html().replace(/\s+/g, '');
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
        date: '2008-04-23 18:25:43.000',
        items: this.itemsArray,
        transactionType: 0
      };
    itemData.not($('[name=record-purchases] tfoot tr td#addButton')).html('');
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
    this.transacService.postTransacs(this.transaction).subscribe(response => {
      console.log(response);
    });
    console.log('purchase posted');
  }



  ///
  ///OTHER
  ///
  checkItem(saleItem: HTMLInputElement) {
    // check input value against server and display results in popup
  }
}

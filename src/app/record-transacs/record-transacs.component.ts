import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-record-transacs',
  templateUrl: './record-transacs.component.html',
  styleUrls: ['./record-transacs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordTransacsComponent implements OnInit {
  // local variables
  typeOfRecord = false;
  purchaseItems = [];
  saleItems = [];

  constructor() { }

  ngOnInit() {
    console.log(this.typeOfRecord);

    $(function () {
      $('[href="#sale"]').on('click', () => {
        setTimeout(() => {
          $('[name=record-sales] tfoot tr').children('td').eq(0).focus();
        }, 0);
      });
      $('[href="#purchase"]').on('click', () => {
        this.typeOfRecord = true;
        setTimeout(() => {
          $('[name=record-purchases] tfoot tr').children('td').eq(0).focus();
        }, 0);
      });
    });
  }

  addSaleItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    // item.parentElement.parentElement.parentElement
    const itemData = $('[name=record-sales] tfoot tr').eq(0).children('td');
    this.saleItems.push({
      item: itemData.html().replace(/\s+/g, ''),
      amount: +itemData.eq(1).html().replace(/\s+/g, '')
    });
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
  getTotalPurchaseAmount() {
    let total = 0;
    for (let i = 0; i < this.purchaseItems.length; i++) {
      total += this.purchaseItems[i].amount;
    }
    return total;
  }
  checkItem(saleItem: HTMLInputElement) {
    // check input value against server and display results in popup
  }

  addPurchaseItem(x, item: HTMLInputElement, price: HTMLInputElement) {
    // item.parentElement.parentElement.parentElement
    console.log(item.parentElement.parentElement.parentElement);
    const itemData = $('[name=record-purchases] tfoot tr').eq(0).children('td');
    this.purchaseItems.push({
      item: itemData.html().replace(/\s+/g, ''),
      amount: +itemData.eq(1).html().replace(/\s+/g, '')
    });
    itemData.not($('[name=record-purchases] tfoot tr td#addButton')).html('');
  }
  removePurchaseItem(x) {
    this.purchaseItems.splice(x, 1);
  }

  postPurchase(){
    console.log('purchase posted');
  }
  postSale(){
    console.log('sale posted');
  }
}

import { Item } from 'app/shared/item.model';
import { ItemService } from './../services/items.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    setTimeout(() => {
      $('table tfoot tr td').eq(0).focus();
    }, 0);
  }

  addItem() {
    // itemName, unit, quantity, purchaseCost, sellingPrice
    const $itemData = $('[name=record-items] tfoot tr').eq(0).children('td');
    const itemName = $itemData.eq(0).html();
    const unit = $itemData.eq(1).html();
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
    $itemData.not($('[name=record-items] tfoot tr td#addButton')).html('');
    $itemData.eq(0).focus();
  }

  removeItem(x) {
    this.items.splice(x, 1);
  }

  postItems() {
    console.log(this.items);
    const $itemData = $('[name=record-items] tfoot tr').eq(0).children('td');
    this.itemService.addItems(this.items)
      .subscribe(response => {
        console.log(response);
      });
      this.items = [];
  }

  clickAddButton(){
    // $('#addButton a').trigger('click');
    // $('#addButton a').eq(0).click();
    document.getElementById("addisiaButton").click();
  }

  getNumberOfItems() {
    return this.items.length;
  }
}

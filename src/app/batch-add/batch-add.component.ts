import { ItemService } from 'app/services/items.service';
import { IItem } from './../interfaces/item.interface';
import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'np-batch-add',
  templateUrl: './batch-add.component.html',
  styleUrls: ['./batch-add.component.css']
})
export class BatchAddComponent {
  constructor(private itemsService: ItemService) {}

  checkPassword(pass: string, passEl: HTMLInputElement, textAreaEl: HTMLInputElement) {
    if (passEl.value === pass) {
      $(textAreaEl).removeAttr('disabled');
    }
  }
  tryParseItems(textAreaEl: HTMLInputElement) {
    if (textAreaEl.value.length > 0) {
      const items: IItem[] = [];
      const arrItems: string[] = textAreaEl.value.split('\n');
      for (let i = 0; i < arrItems.length; i++) {
        const itemParts = arrItems[i].split('\t');
        const itemObj: IItem = {
          itemId: 0,
          itemName: '',
          purchaseCost: 0,
          sellingPrice: 0,
          unit: 'pc',
          quantity: 0
        };
        for (let j = 0; j < itemParts.length; j++) {
          switch (j) {
            case 0:
              itemObj.itemName = itemParts[j];
              break;
            case 1:
              itemObj.purchaseCost = typeof(+itemParts[j]) === 'number' ? +itemParts[j] : 0;
              break;
            case 2:
              itemObj.sellingPrice = typeof(+itemParts[j]) === 'number' ? +itemParts[j] : 0;
              break;
            case 3:
              itemObj.unit = itemParts[j] === '' ? 'pc' : itemParts[j];
              break;
            case 4:
              itemObj.quantity = 0;
              break;
            case 5:
              itemObj.aliases = itemParts[j];
              break;
            default:
              console.log('Impossible error, but still, congratulations!');
          }
        }
        items.push(itemObj);
      }
      this.postItems(items);
    } else {
      console.log('nothing to post');
    }

  }
  postItems(items: IItem[]) {
    this.itemsService.addItems(items)
      .subscribe(res => {
        alert('successfull');
      }, err => {
        alert('not successful, try again later');
      });
  }
}

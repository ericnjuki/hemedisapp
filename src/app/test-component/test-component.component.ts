import { Component, OnInit } from '@angular/core';
import { ItemService } from 'app/services/items.service';
import { IItem } from 'app/interfaces/item.interface';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app',
  templateUrl: './test-component.component.html'
})
export class TestComponentComponent implements OnInit {
  public items;

  constructor(private itemService: ItemService) {

  }
  ngOnInit() {
    this.itemService.getAllItems()
      .map((res: Response) => {
        console.log('res:' + res);
        return res;
      })
      .subscribe(jsonItems => {
        this.items = jsonItems;
        console.log('jsonItems' + jsonItems);
        // this.items = jsonItems;
        // console.log(this.items);
      });
    console.log('this.items' + this.items);
  }
}

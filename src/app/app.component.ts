import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { ItemService } from 'app/services/items.service';

import { INPState } from './store/store';
import { loadItems } from 'app/actions/action-creators';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(ngRedux: NgRedux<INPState>, itemService: ItemService) {
    itemService.getAllItems()
    .subscribe(res => {
      ngRedux.dispatch(loadItems(res));
    })
  }

  ngOnInit() {
    $(function () {
      $('.app-header').addClass('bx-shadow');
    });
  }
}

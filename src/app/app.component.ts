import { Component, OnInit } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from './interfaces/appstate.interface';
import { CLEAR, RESET_ITEMS } from './app.actions';
import { ItemService } from './services/items.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(
    private itemService: ItemService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {
    $(function() {
      $('.app-header').addClass('bx-shadow');
    });
  }

  addTestData() {
    this.itemService.getDbItems().subscribe(itemsFromDb => {
      this.ngRedux.dispatch({ type: RESET_ITEMS, items: itemsFromDb });
    });
  }
  clearDemo() {
    this.ngRedux.dispatch({ type: CLEAR });
  }
}

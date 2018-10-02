import { HttpInterceptor } from './../shared/error handlers/interceptor.http';
import { Item } from './../shared/item.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { dbStockItems } from '../shared/app.db';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../interfaces/appstate.interface';
import { ADD_ITEMS, UPDATE_ITEMS, DELETE_ITEMS } from '../app.actions';

/**
 * Interacts with remote api to retrieve various item data
 */
@Injectable()
export class ItemService {
  private _url = 'http://localhost:1111/api/v1.0/items/';
  public event: EventEmitter<any>;

  @select((s: IAppState) => s.stockItems) stateStockItems;

  constructor(
    private http: HttpInterceptor,
    private ngRedux: NgRedux<IAppState>
  ) {}

  getItems() {
    return this.stateStockItems;
  }
  getDbItems() {
    return Observable.of(dbStockItems);
  }

  addItems(items: Item[]) {
    this.ngRedux.dispatch({ type: ADD_ITEMS, items: items });
    return this.stateStockItems;
  }

  updateItems(items) {
    this.ngRedux.dispatch({ type: UPDATE_ITEMS, items: items });
    return this.stateStockItems;
  }

  deleteItems(itemIds: number[]) {
    this.ngRedux.dispatch({ type: DELETE_ITEMS, itemIds: itemIds });
    return this.stateStockItems;
  }
}

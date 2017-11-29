import { Item } from './../shared/item.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Interacts with remote api to retrieve various item data
 */
@Injectable()
export class ItemService {
    private _url = 'http://shopassisst2.azurewebsites.net/api/v1.0/items/';
    public event: EventEmitter<any>;

    constructor(private http: Http) { }
    getAllItems() {
        return this.http.get(this._url + 'g')
            .map(response => response.json());
    }
    searchItems() {
        return this.http.get(this._url + 'g/names')
            .map((response: Response) => response.json());
    }

    addItems(items: Item[]) {
        return this.http.post(this._url + 'p', items);
    }

    updateItems(items) {
        return this.http.put(this._url + 'u', items);
    }
}

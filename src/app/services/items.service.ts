import { Item } from './../shared/item.model';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    /**
     *
     */
    private _url = 'http://localhost:51191/api/v1.0/items/';
    // private _url = 'http://shopassisst2.azurewebsites.net/api/v1.0/items/';
    private _headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http) { }
    getAllItems() {
        return this.http.get(this._url + 'g')
            .map(response => response.json());
    }
    searchItems() {
        return this.http.get(this._url + 'g/names')
            .map((response: Response) => response.json());
    }

    addItems(item: Item[]) {
        return this.http.post(this._url + 'p', item);
    }
}

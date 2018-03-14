import { HttpInterceptor } from './../shared/error handlers/interceptor.http';
import { Item } from './../shared/item.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Interacts with remote api to retrieve various item data
 */
@Injectable()
export class ItemService {
    private _url = 'http://localhost:1111/api/v1.0/items/';
    private options: RequestOptions = new RequestOptions();
    public event: EventEmitter<any>;

    constructor(private http: HttpInterceptor) { }
    getAllItems() {
        return this.http.get(this._url + 'g')
            .map(response => response.json());
    }
    getItemNames() {
        return this.http.get(this._url + 'g/names')
            .map((response: Response) => response.json());
    }

    addItems(items: Item[]) {
        return this.http.post(this._url + 'p', items);
    }

    updateItems(items) {
        return this.http.put(this._url + 'u', items);
    }

    deleteItems(items: number[]) {
        this.options.body = items;
        return this.http.delete(this._url + 'd', this.options)
            .map((respnse: Response) => respnse.json());
    }
}

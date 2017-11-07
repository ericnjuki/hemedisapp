import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    /**
     *
     */
    private _url = 'http://localhost:51191/api/v1.0/items/';

    constructor(private http: Http) { }
    searchItems() {
        return this.http.get(this._url + 'g')
        .map((response: Response) => response.json());
        // return this.http.get(this._url + 'g');
        // return ['eric', 'erric'];
    }
}
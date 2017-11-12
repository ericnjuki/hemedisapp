import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { ITransactionData } from 'app/interfaces/transacs.interface';

@Injectable()
export class TransactionService {
    private _url = 'http://localhost:51191/api/v1.0/transacs/';
    private _headers = new Headers({
        'Content-Type': 'application/json'
    });
    private options: RequestOptionsArgs = {
        search: new URLSearchParams('includeItems=true'),
    };

    constructor(private _http: Http) { }
    getTransacs(includeItems: boolean) {
        console.log(includeItems);
        if (includeItems) {
            return this._http.get(this._url + 'g', this.options)
                .map((response: Response) => response.json());
        }
        return this._http.get(this._url + 'g')
            .map((response: Response) => response.json());
    }
    getStatsData() {
        return this._http.get(this._url + 'g/stats')
            .map((response: Response) => response.json());

    }
    postTransacs(transactionObject: ITransactionData) {
        console.log(transactionObject);
        return this._http.post(this._url + 'p', transactionObject, this._headers);

    }
}

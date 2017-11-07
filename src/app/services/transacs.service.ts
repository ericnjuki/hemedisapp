import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ITransactionData } from "app/interfaces/transacs.interface";

@Injectable()
export class TransactionService {
    private _url = 'http://localhost:51191/api/v1.0/transacs/';
    private _headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private _http: Http) { }
    getTransacs() {
        return this._http.get(this._url + 'g')
            .map((response: Response) => response.json());
    }

    postTransacs(transactionObject: ITransactionData) {
        console.log(transactionObject);
        return this._http.post(this._url + 'p', transactionObject, this._headers);
    }
}

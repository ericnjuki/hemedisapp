import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { ITransactionData } from 'app/interfaces/transacs.interface';

@Injectable()
export class TransactionService {
    // private _url = 'http://localhost:1111/api/v1.0/transacs/';
    private _url = 'http://localhost:51191/api/v1.0/transacs/';
    // private _url = 'http://shopassisst2.azurewebsites.net/api/v1.0/transacs/';

    private options: RequestOptionsArgs = {};

    constructor(private _http: Http) { }
    getTransacs(includeItems: boolean) {
        this.options.search = new URLSearchParams('includeItems=true');
        if (includeItems) {
            return this._http.get(this._url + 'g', this.options)
                .map((response: Response) => response.json());
        }
        return this._http.get(this._url + 'g')
            .map((response: Response) => response.json());
    }
    getStatsData(year: number) {
        this.options.search = new URLSearchParams('forYear=' + year.toString());
        return this._http.get(this._url + 'g/stats', this.options)
            .map((response: Response) => response.json());

    }
    postTransacs(transactionObject: ITransactionData) {
        return this._http.post(this._url + 'p', transactionObject);

    }
}

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { ITransactionData } from 'app/interfaces/transacs.interface';
/**
 * Interacts with remote api to retrieve various transaction data
 */
@Injectable()
export class TransactionService {
    private _url = 'http://localhost:51191/api/v1.0/transacs/';

    private options: RequestOptions = new RequestOptions();

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

    getStatsData(year: number, month: number, day: number) {
        this.options.search = new URLSearchParams('date=' + year.toString() + '/' + month.toString() + '/' + day.toString());
        return this._http.get(this._url + 'g/stats', this.options)
            .map((response: Response) => response.json());
    }
    getStatsForYear(year: number) {
        this.options.search = new URLSearchParams('forYear=' + year.toString());
        return this._http.get(this._url + 'g/stats', this.options)
            .map((response: Response) => response.json());
    }

    postTransacs(transactionObject: ITransactionData) {
        return this._http.post(this._url + 'p', transactionObject);
    }

    deleteTransacs(transactionObjects: number[]) {
        this.options.body = transactionObjects;
        return this._http.delete(this._url + 'd', this.options)
            .map((response: Response) => response.json());
    }
}

import { HttpInterceptor } from './../shared/error handlers/interceptor.http';
import { Injectable } from '@angular/core';
import {
  Response,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import 'rxjs/add/operator/map';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../interfaces/appstate.interface';
import { POST_TRANSACTIONS, DELETE_TRANSACTIONS } from '../app.actions';
import { Observable } from 'rxjs/Observable';
/**
 * Interacts with remote api to retrieve various transaction data
 */
@Injectable()
export class TransactionService {
  private _url = 'http://localhost:1111/api/v1.0/transacs/';

  private options: RequestOptions = new RequestOptions();

  @select((s: IAppState) => s.transactions)
  stateTransacions;

  constructor(
    private _http: HttpInterceptor,
    private ngRedux: NgRedux<IAppState>
  ) {}
  getTransacs() {
    return this.stateTransacions;
  }

  getStatsData(year: number, month: number, day: number) {
    this.options.search = new URLSearchParams(
      'date=' + year.toString() + '/' + month.toString() + '/' + day.toString()
    );
    return this._http
      .get(this._url + 'g/stats', this.options)
      .map((response: Response) => response.json());
  }
  getStatsForYear(year: number) {
    this.options.search = new URLSearchParams('forYear=' + year.toString());
    return this._http
      .get(this._url + 'g/stats', this.options)
      .map((response: Response) => response.json());
  }

  postTransacs(transactionObject: ITransactionData) {
    this.ngRedux.dispatch({ type: POST_TRANSACTIONS, data: transactionObject });
    return Observable.of('success?');
  }

  deleteTransacs(transactionIds: number[]) {
    this.ngRedux.dispatch({type: DELETE_TRANSACTIONS, transactionIds: transactionIds})
    return Observable.of('');
  }
}

import { Injectable } from '@angular/core';
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

  @select((s: IAppState) => s.transactions)
  stateTransacions;

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) {}
  getTransacs() {
    return this.stateTransacions.delay(1500);
  }

  getStatsForYear(year: number) {
    return this.stateTransacions.delay(1500);
  }

  postTransacs(transactionObject: ITransactionData) {
    this.ngRedux.dispatch({ type: POST_TRANSACTIONS, data: transactionObject });
    return Observable.of('success?').delay(1000);
  }

  deleteTransacs(transactionIds: number[]) {
    this.ngRedux.dispatch({type: DELETE_TRANSACTIONS, transactionIds: transactionIds})
    return Observable.of('success?').delay(1000);
  }
}

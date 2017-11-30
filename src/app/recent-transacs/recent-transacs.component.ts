import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'app/services/transacs.service';
import { TransactionData } from 'app/shared/transacs.model';
import { ITransactionData } from 'app/interfaces/transacs.interface';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

/**
 * Gets recent transactions from a service and displays them
 * using child component "TransactionPillComponent"
 */
@Component({
  selector: 'app-recent-transacs',
  templateUrl: './recent-transacs.component.html',
  styleUrls: ['./recent-transacs.component.css']
})
export class RecentTransacsComponent implements OnInit {
  transactions: Array<ITransactionData> = [];
  includeItems = true;

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private transacService: TransactionService) { }

  ngOnInit() {
    const firstToast = this.addToast();
    this.transacService.getTransacs(this.includeItems)
      .subscribe(allTransactions => {
        this.transactions = allTransactions;
        this.toastyService.clear(firstToast);
      });
  }

  extendPill(i: number) {
    $('.pill').eq(i).children('.app-panel-body').toggleClass('panel-clicked app-panel-body-lg');
  }

  addToast() {
    let toastId;
    const toastOptions: ToastOptions = {
      title: 'Update Status',
      msg: 'fetching data...',
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    this.toastyService.wait(toastOptions);
    return toastId;
  }
}

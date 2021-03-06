import { AppMonths } from './../shared/enums/months.enum';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'app/services/transacs.service';
import { TransactionData } from 'app/shared/transacs.model';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';
import { NpModalOptions } from 'app/shared/np-modal-options';

@Component({
  selector: 'app-recent-transacs',
  templateUrl: './recent-transacs.component.html',
  styleUrls: ['./recent-transacs.component.css']
})
export class RecentTransacsComponent implements OnInit {
  // user interaction (modal)
  modalOpts: NpModalOptions = new NpModalOptions();
  transacIdsToDelete: number[] = [];
  showDialog = false;

  selectedMonth = AppMonths[new Date().getUTCMonth().valueOf()];
  selectedYear = new Date().getUTCFullYear().valueOf();
  yearOptions = [];

  // fetching data
  includeItems = true;

  // displayed data
  transactions: Array<TransactionData> = [];
  displayedTransacs = [];
  monthStrings = [];

  constructor(
    private toastyService: ToastyService,
    private transacService: TransactionService) { }

  ngOnInit() {
    this.getTransacs(new Date().toUTCString());
    for (const month in AppMonths) {
      if (typeof AppMonths[month] === 'number') {
        this.monthStrings.push(month);
      }
    }
    this.updateYearOpts();
  }

  changeYear(yearOpts: HTMLSelectElement) {
    const selectedYear = parseInt(yearOpts.selectedOptions[0].value, 10);
    this.selectedYear = selectedYear;

    const forDate = new Date(Date.UTC(this.selectedYear, AppMonths[this.selectedMonth])).toUTCString();
    this.getTransacs(forDate);
  }
  changeMonth(selectedMonth) {
    this.selectedMonth = selectedMonth;

    const forDate = new Date(Date.UTC(this.selectedYear, AppMonths[this.selectedMonth])).toUTCString();
    this.getTransacs(forDate);
  }

  getTransacs(date: string) {
    const firstToast = this.addToast('wait', 'Fetching records...');
    this.transacService.getTransacs(date, this.includeItems)
      .subscribe(allTransactions => {
        this.toastyService.clear(firstToast);
        let maxItemNumber = 0;
        this.transactions = allTransactions;
        // for each transaction
        for (let t = 0; t < this.transactions.length; t++) {
          this.transactions[t].total = 0;
          const shortDateString = this.transactions[t].date.substr(0, 10);
          const shortYear = shortDateString.substr(0, 4);
          const shortMonth = shortDateString.substr(5, 2);
          const shortDay = shortDateString.substr(8, 2);
          this.transactions[t].date = shortDay + '/' + shortMonth + '/' + shortYear;

          // get items in transaction
          for (let i = 0; i < this.transactions[t].items.length; i++) {
            // calculate total of items in it, sum them and store them
            // in transac total
            if (this.transactions[t].transactionType === 1) {
              this.transactions[t].items[i].total = this.transactions[t].items[i].sellingPrice * this.transactions[t].items[i].quantity;
              this.transactions[t].total += this.transactions[t].items[i].total;
            }
            if (this.transactions[t].transactionType === 2) {
              this.transactions[t].items[i].total = this.transactions[t].items[i].purchaseCost * this.transactions[t].items[i].quantity;
              this.transactions[t].total += this.transactions[t].items[i].total;
            }
          }
        }
        // number of items in
        // transac with most items
        this.transactions.forEach((transac) => {
          if (transac.items.length > maxItemNumber) {
            maxItemNumber = transac.items.length;
          }
        });

        // reverse order of transacs
        for (let i = 0; i < this.transactions.length; i++) {
          this.displayedTransacs.unshift(this.transactions[i]);
        }
      }, err => {
        this.toastyService.clear(firstToast);
      });
    this.displayedTransacs = [];
    this.transactions = [];
  }

  updateYearOpts() {
    for (let i = -4; i <= 4; i++) {
      if (i === 0) {
        this.yearOptions.push(this.selectedYear);
        continue;
      }
      this.yearOptions.push(this.selectedYear + i);
    }
  }

  deleteTransacs(transacIds: number[]) {
    const firstToast = this.addToast('wait', 'Deleting...');
    // let arrNewTransacs: any[] = [];
    this.transacService.deleteTransacs(this.transacIdsToDelete)
      .subscribe(() => {
        // arrNewTransacs = newTransacs;
        // update ngFored var here
        this.toastyService.clear(firstToast);
        this.addToast('info', 'Deleted!');
        const forDate = new Date(Date.UTC(this.selectedYear, AppMonths[this.selectedMonth])).toUTCString();
        this.getTransacs(forDate);
      });
    this.transacIdsToDelete = [];
  }

  isConfirmed(eventData) {
    this.showDialog = false;
    if (eventData) {
      this.deleteTransacs(this.transacIdsToDelete);
      return;
    }
  }

  showModal(flag, transacIds?: number[], transacId?: number, ) {
    transacIds.push(transacId);
    this.transacIdsToDelete = transacIds;
    this.modalOpts.body = 'Delete ' + this.transacIdsToDelete.length.toString() + ' transactions?';
    this.showDialog = flag;
  }

  addToast(toastType: string, message: string) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    toastOptions.title = '';
    toastOptions.msg = message;
    toastOptions.theme = 'bootstrap';
    toastOptions.timeout = 3000;

    switch (toastType) {
      case 'wait':
        toastOptions.timeout = 23000;
        this.toastyService.wait(toastOptions);
        break;
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      default:
        this.toastyService.default(toastOptions);
    }
    return toastId;
  }
}

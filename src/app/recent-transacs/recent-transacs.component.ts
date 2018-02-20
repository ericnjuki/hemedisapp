import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'app/services/transacs.service';
import { TransactionData } from 'app/shared/transacs.model';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Item } from 'app/shared/item.model';
import { NpModalOptions } from 'app/shared/np-modal-options';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
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
  // user interaction (modal)
  checkedTransacs: any[];
  modalOpts: NpModalOptions = new NpModalOptions();
  transacIdsToDelete: number[] = [];
  showDialog = false;

  // fetching data
  includeItems = true;

  // displayed data
  transactions: Array<TransactionData> = [];
  items: Array<Item> = [];
  potato: Item = { itemId: -1, itemName: '', unit: '', quantity: 0, sellingPrice: 0, purchaseCost: 0 };
  total = 0;
  displayedTransacs = [];

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private transacService: TransactionService) { }

  ngOnInit() {
    this.getTransacs();
  }

  getTransacs() {
    const firstToast = this.addToast('wait', 'Fetching records...');
    this.transacService.getTransacs(this.includeItems)
      .subscribe(allTransactions => {
        console.log(allTransactions);
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
      });
    this.displayedTransacs = [];
    this.transactions = [];
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
        this.getTransacs();
      });
    this.transacIdsToDelete = [];
  }

  deleteMany() {
    const transacIds: number[] = [];
    for (let i = 0; i < this.checkedTransacs.length; i++) {
      transacIds.push(this.checkedTransacs[i].itemId);
    }
    this.showModal(true, transacIds);
  }

  isConfirmed(eventData) {
    this.showDialog = false;
    if (eventData) {
      this.deleteTransacs(this.transacIdsToDelete);
      this.checkedTransacs = [];
      return;
    }
  }

  showModal(flag, transacIds?: number[], transacId?: number, ) {
    transacIds.push(transacId);
    this.transacIdsToDelete = transacIds;
    this.modalOpts.body = 'Delete ' + this.transacIdsToDelete.length.toString() + ' transactions?';
    this.showDialog = flag;
  }

  extendPill(i: number) {
    $('.pill').eq(i).children('.app-panel-body').toggleClass('panel-clicked app-panel-body-lg');
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

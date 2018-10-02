import { TransactionService } from 'app/services/transacs.service';
import { AppMonths } from './../shared/enums/months.enum';
import { Component, OnInit, Input } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

/**
 * Where monthly statistics are displayed in a table
 */
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  // on stats display
  today = new Date();
  statsDate = {
    year: this.today.getUTCFullYear(),
    month: this.today.getUTCMonth(),
    day: this.today.getUTCDay()
  };
  monthlyStats = [];

  // view controllers
  appMonths = [];
  constructor(
    private transacService: TransactionService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) { }

  ngOnInit() {
    this.getStatsForYear(this.statsDate.year);
    for (let i = 0; i <= 11; i++) {
      this.appMonths.push(AppMonths[i]);
    }
  }

  getStatsForYear(year: number) {
    const firstToast = this.addToast();
    this.monthlyStats = [];

    this.transacService.getStatsForYear(year)
      .subscribe(allTransactions => {
        const allTransacDateStrings = Object.keys(allTransactions);
        const stats = [];

        for (let i = 0; i < allTransacDateStrings.length; i++) {
          const monthlySales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          const monthlyPurchases = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          const monthlyProfitLoss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          const currentMonth = new Date(allTransacDateStrings[i]).getMonth();
          const transacsOfCurrentDate = allTransactions[allTransacDateStrings[i]];
          // iterating transactions in a day
          for (let j = 0; j < transacsOfCurrentDate.length; j++ ) {
            const currentTransaction = transacsOfCurrentDate[j];
            let currentTransacTotalSales = 0;
            let currentTransacTotalPurchases = 0;
            let currentTransacProfitLoss = 0;
            // iterating items in a transaction
            for (let k = 0; k < transacsOfCurrentDate[j].items.length; k++) {
              const currentTransaclyTotalSales = currentTransaction.items[k].sellingPrice * currentTransaction.items[k].quantity;
              const currentTransaclyTotalPurchases = currentTransaction.items[k].purchaseCost * currentTransaction.items[k].quantity;
              const currentTransaclyProfitLoss = currentTransaclyTotalSales - currentTransaclyTotalPurchases;
              currentTransacTotalSales += currentTransaclyTotalSales;
              currentTransacTotalPurchases += currentTransaclyTotalPurchases;
              currentTransacProfitLoss += currentTransaclyProfitLoss;
            }
            switch (transacsOfCurrentDate[j].transactionType) {
              case 1:
                monthlySales[currentMonth] += currentTransacTotalSales;
                monthlyProfitLoss[currentMonth] += currentTransacProfitLoss;
                break;
              case 2:
                monthlyPurchases[currentMonth] += currentTransacTotalPurchases;
                break;
              default:
                break;
            }
          }
          const currentTransacDate = new Date(allTransacDateStrings[i]);

          if (currentTransacDate.getFullYear() === new Date(year, 0).getFullYear()) {
            for (let m = 0; m <= 11; m++) {
              if (stats.length < 12) {
                const dataOfMonth = {
                  month: AppMonths[m],
                  sales: monthlySales[m],
                  purchases: monthlyPurchases[m],
                  profitLoss: monthlyProfitLoss[m]
                }
                stats.push(dataOfMonth);
              } else {
                stats[m].sales += monthlySales[m];
                stats[m].purchases += monthlyPurchases[m];
                stats[m].profitLoss += monthlyProfitLoss[m];
              }
            }
          }
        }
        this.monthlyStats = stats;
        this.toastyService.clear(firstToast);
      });
  }

  previousYear() {
    const newYear = (+(this.statsDate.year) - 1);
    this.getStatsForYear(newYear);
    this.statsDate.year = newYear;
  }

  nextYear() {
    const newYear = (+(this.statsDate.year) + 1);
    this.getStatsForYear(newYear);
    this.statsDate.year = newYear;
  }

  addToast() {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
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

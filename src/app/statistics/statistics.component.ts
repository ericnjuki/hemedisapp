import { TransactionService } from 'app/services/transacs.service';
import { AppMonths } from './../shared/enums/months.enum';
import { Http } from '@angular/http';
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
    this.transacService.getStatsForYear(year)
      .subscribe(theData => {
        // converting int months (i.e. 0, 1, 2...) into my enum strings (JAN, FEB...)
        for (const data of theData) {
          data.month = AppMonths[data.month];
        }
        this.monthlyStats = theData;
        this.toastyService.clear(firstToast);
      }, err => {
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

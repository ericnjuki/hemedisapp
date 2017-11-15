import { TransactionService } from 'app/services/transacs.service';
import { AppMonths } from './../shared/enums/months.enum';
import { Http } from '@angular/http';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  today = new Date();
  statsDate = {
    year: this.today.getUTCFullYear(),
    month: this.today.getUTCMonth(),
    day: this.today.getUTCDay()

  };
  monthlyStats = [];
  // monthlyStats: Array<{ month: string, sale: number, purchase: number, profit: number }>;
  constructor(private transacService: TransactionService) { }

  ngOnInit() {
    this.getStatsForYear(this.statsDate.year);
  }

  getStatsForYear(year: number) {
    this.transacService.getStatsData(year)
    .subscribe(theData => {
      // converting int months (i.e. 0, 1, 2...) into my enum strings (JAN, FEB...)
      for(const data of theData){
        data.month = AppMonths[data.month];
      }
      this.monthlyStats = theData;
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
}

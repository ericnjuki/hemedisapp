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
    year: this.today.getUTCFullYear().toString(),
    month: this.today.getUTCMonth(),
    day: this.today.getUTCDay()

  };
  monthlyStats = [];
  // monthlyStats: Array<{ month: string, sale: number, purchase: number, profit: number }>;
  constructor(private transacService: TransactionService) { }

  ngOnInit() {
    this.transacService.getStatsData()
      .subscribe(theData => {
        // converting int months (i.e. 0, 1, 2...) into my enum strings (JAN, FEB...)
        for(let data of theData){
          data.month = AppMonths[data.month];
        }
        this.monthlyStats = theData;
      });

  }
  previousYear() {
    const x = +(this.statsDate.year) - 1;
    this.statsDate.year = x.toString();

  }
  nextYear() {
    const x = +(this.statsDate.year) + 1;
    this.statsDate.year = x.toString();

  }
}

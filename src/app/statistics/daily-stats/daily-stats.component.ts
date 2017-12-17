import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMonths } from './../../shared/enums/months.enum';
import { TransactionService } from 'app/services/transacs.service';

@Component({
  selector: 'np-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {
  // used to fetch stats
  currentYear: number;
  currentMonth: string;
  currentDay: string;


  // for querying data
  dailyItems;

  constructor(private route: ActivatedRoute, private transacService: TransactionService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentYear = params['year'];
      this.currentMonth = params['month'];
      this.currentDay = params['day'];
    });
    this.getStats(this.currentYear, AppMonths[this.currentMonth], +this.currentDay);
  }

  previousDay() {
    this.router.navigate(['/stats', this.currentYear, this.currentMonth, this.currentDay ], { relativeTo: this.route });
    const month: number = AppMonths[this.currentMonth];
    let day = +this.currentDay;
    day--;
    this.getStats(this.currentYear, month, day);

    if (day < 10) {
      this.currentDay = '0' + day.toString();
      return
    }
    this.currentDay = day.toString();
    console.log(this.currentDay);
  }
  nextDay() {
    this.router.navigate(['/stats', this.currentYear, this.currentMonth, this.currentDay ], { relativeTo: this.route });
    // this.router
    // .navigate(['../../', { year: this.currentYear, month: this.currentMonth, day: this.currentDay }], { relativeTo: this.route })
    const month: number = AppMonths[this.currentMonth];
    let day = +this.currentDay;
    day++;
    this.getStats(this.currentYear, month, day);

    if (day < 10) {
      this.currentDay = '0' + day.toString();
      return
    }
    this.currentDay = day.toString();
  }

  getStats(year: number, month: number, day: number) {
    console.log(year);
    console.log(month);
    console.log(day);
    // this.transacService.getStatsData(year, month, day)
    //   .subscribe(dailyData => {
    //     this.dailyItems = dailyData;
    //   });
  }
}

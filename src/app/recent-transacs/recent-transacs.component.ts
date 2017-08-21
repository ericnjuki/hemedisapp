import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-transacs',
  templateUrl: './recent-transacs.component.html',
  styleUrls: ['./recent-transacs.component.css']
})
export class RecentTransacsComponent implements OnInit {
  transactions: any[] = [''];
  constructor() { }

  ngOnInit() {
  }

  addTransac() {
    this.transactions.push(23);
  }
  extendPill(i: number) {
    $('.pill').eq(i).children('.app-panel-body').toggleClass('panel-clicked app-panel-body-lg');

  }
}

import { Component, OnInit } from '@angular/core';
import { TransactionService } from "app/services/transacs.service";
import { TransactionData } from "app/shared/transacs.model";
import { ITransactionData } from "app/interfaces/transacs.interface";

@Component({
  selector: 'app-recent-transacs',
  templateUrl: './recent-transacs.component.html',
  styleUrls: ['./recent-transacs.component.css']
})
export class RecentTransacsComponent implements OnInit {
  transactions: Array<ITransactionData> = [];
  includeItems = true;
  constructor(private transacService: TransactionService) { }

  ngOnInit() {
    this.transacService.getTransacs(this.includeItems)
      .subscribe(allTransactions => {
        this.transactions = allTransactions;
      });
  }

  addTransac() {

  }
  extendPill(i: number) {
    $('.pill').eq(i).children('.app-panel-body').toggleClass('panel-clicked app-panel-body-lg');

  }
}

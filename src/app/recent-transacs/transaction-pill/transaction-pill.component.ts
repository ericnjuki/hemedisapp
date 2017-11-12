import { Component, OnInit, Input } from '@angular/core';
import { TransactionData } from "app/shared/transacs.model";

@Component({
  selector: 'app-transaction-pill',
  templateUrl: './transaction-pill.component.html',
  styleUrls: ['./transaction-pill.component.css']
})
export class TransactionPillComponent implements OnInit {
  @Input() transactionData: TransactionData;
  total = 0;
  isPurchase = false;
  constructor() { }

  ngOnInit() {
    for (const item of this.transactionData.items) {
      this.total += item.sellingPrice;

    }
    if (this.transactionData.transactionType === 1) {
      this.isPurchase = true;

    }
  }

}

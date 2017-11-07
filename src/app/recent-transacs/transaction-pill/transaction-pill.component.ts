import { Component, OnInit, Input } from '@angular/core';
import { TransactionData } from "app/shared/transacs.model";

@Component({
  selector: 'app-transaction-pill',
  templateUrl: './transaction-pill.component.html',
  styleUrls: ['./transaction-pill.component.css']
})
export class TransactionPillComponent implements OnInit {
  @Input() pillData: TransactionData;
  total = 0;
  constructor() { }

  ngOnInit() {
    for (const item of this.pillData.items) { this.total += item.sellingPrice; }
  }

}

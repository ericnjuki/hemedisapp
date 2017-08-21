import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-record-transacs',
  templateUrl: './record-transacs.component.html',
  styleUrls: ['./record-transacs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordTransacsComponent implements OnInit {
  // local variables
  saleItems = [{
    item: '',
    amount: null,
  }];
  saleAmount = this.getTotalSaleAmount();

  constructor() { }

  ngOnInit() {
  }

  addRemoveSaleItem(i) {
    const addRemoveButton = $('[name="record-sales"] tr').find('a').eq(i);
    if (addRemoveButton.children('i').hasClass('ion-android-add-circle')) {
      this.saleItems.push({
        item: 'Eric',
        amount: 1
      });
      addRemoveButton.children('i')
        .removeClass('ion-android-add-circle')
        .addClass('ion-android-remove-circle');
    } else {
      console.log(i);
      this.saleItems.splice(i, 1);

    }
    // $('tbody tr th').eq(1).html(this.getTotalSaleAmount().toString());
  }

  getTotalSaleAmount(){
    // TO DO: efficientify this psst: use for..in
    let total = 0;
    for (let i = 0; i < this.saleItems.length; i++) {
      total += this.saleItems[i].amount;
    }
    return total;
  }
}

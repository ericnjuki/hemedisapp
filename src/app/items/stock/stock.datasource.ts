// import { ExampleDatabase } from 'app/items/stock/example.database';
// import { DataSource } from '@angular/cdk/table';
// import { Observable } from 'rxjs/rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
import { IItem } from 'app/interfaces/item.interface';
import { ItemService } from 'app/services/items.service';
import { MatTableDataSource } from '@angular/material/table';

export class StockDataSource extends MatTableDataSource<any> {
    dataChange: BehaviorSubject<IItem[]> = new BehaviorSubject<IItem[]>([]);
    customData = [
        {
            'itemName': 'kimangop',
            'quantity': 10,
            'unit': 'pole',
            'purchaseCost': 120,
            'sellingPrice': 150

        },
        {
            'itemName': 'dagger',
            'quantity': 98,
            'unit': 'hadi',
            'purchaseCost': 2,
            'sellingPrice': 15

        }
    ]

    constructor(
        private _itemService: ItemService) {
        super();
    }

    connect(): BehaviorSubject<IItem[]> {

        this._itemService.getAllItems()
            .subscribe(res => {
                this.dataChange.next(res);
            })
        return this.dataChange;
    }

    disconnect() { }
}

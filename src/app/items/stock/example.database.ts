import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/table';
import { IItem } from 'app/interfaces/item.interface';

export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<IItem[]> = new BehaviorSubject<IItem[]>([]);
    get data(): IItem[] {

        const data = [
            {
                'itemName': 'shatta',
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
        ];

        return data;
    }

    constructor() {

        this.dataChange.next(this.data);
    }
}

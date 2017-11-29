import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IItem } from 'app/interfaces/item.interface';
import { ItemService } from 'app/services/items.service';
import { MatTableDataSource } from '@angular/material/table';

/**
 * Calls a service to get data rendered on mat-table
 */
export class StockDataSource extends MatTableDataSource<any> {
    dataChange: BehaviorSubject<IItem[]> = new BehaviorSubject<IItem[]>([]);

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

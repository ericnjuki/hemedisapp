import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IItem } from 'app/interfaces/item.interface';
import { ItemService } from 'app/services/items.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/rx';

/**
 * Calls a service to get data rendered on mat-table
 */
export class StockDataSource extends DataSource<any> {
    dataChange: BehaviorSubject<IItem[]> = new BehaviorSubject<IItem[]>([]);

    constructor(
        private _paginator,
        private _sorter: MatSort,
        private _itemService: ItemService) {
        super();
    }

    connect(): Observable<IItem[]> {
        const displayDataChanges = [
            this.dataChange,
            this._paginator.page,
            this._sorter.sortChange
        ];
        this._itemService.getAllItems()
            .subscribe(res => {
                this.dataChange.next(res);
            })
        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.getSortedData();
            // Grab the page's slice of data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
    }

    disconnect() { }

    getSortedData(): IItem[] {
        const data = this.dataChange.getValue().slice();
        if (!this._sorter.active || this._sorter.direction === '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sorter.active) {
                case 'itemName':
                    [propertyA, propertyB] = [a.itemName, b.itemName];
                    break;
                case 'purchaseCost':
                    [propertyA, propertyB] = [a.purchaseCost, b.purchaseCost];
                    break;
                case 'sellingPrice':
                    [propertyA, propertyB] = [a.sellingPrice, b.sellingPrice];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sorter.direction === 'asc' ? 1 : -1);
        });
    }
}

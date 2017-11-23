import { ExampleDatabase } from 'app/items/stock/example.database';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IItem } from 'app/interfaces/item.interface';
import { ItemService } from 'app/services/items.service';

export class ExampleDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(
        private _exampleDatabase: ExampleDatabase,
        private _paginator: MatPaginator,
        private _sort: MatSort,
        private _itemService?: ItemService) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    // connect(): Observable<IItem[]> {
    //     const displayDataChanges = [
    //         this._exampleDatabase.dataChange,
    //         this._paginator.page,
    //         this._sort.sortChange
    //     ];

    //     return Observable.merge(...displayDataChanges).map(() => {
    //         const data = this.getSortedData();
    //         // Grab the page's slice of data.
    //         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    //         return data.splice(startIndex, this._paginator.pageSize);
    //     });
    // }
    connect(): Observable<IItem[]> {
        return this._itemService.getAllItems();
    }

    disconnect() { }

    getSortedData(): IItem[] {
        const data = this._exampleDatabase.data.slice();
        if (!this._sort.active || this._sort.direction === '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'shiftDate': [propertyA, propertyB] = [a.itemName, b.itemName]; break;
                case 'swipeIn': [propertyA, propertyB] = [a.purchaseCost, b.purchaseCost]; break;
                case 'swipeOut': [propertyA, propertyB] = [a.sellingPrice, b.sellingPrice]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}

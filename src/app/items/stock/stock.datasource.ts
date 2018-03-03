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
    data: [
        {nada: '1', bla: 'kaka', surf: 'ins'},
        {nada: '2', bla: 'kaka', surf: 'ins'},
        {nada: '3', bla: 'kaka', surf: 'ins'},
        {nada: '4', bla: 'kaka', surf: 'ins'},
        {nada: '5', bla: 'kaka', surf: 'ins'},
        {nada: '6', bla: 'kaka', surf: 'ins'},
        {nada: '7', bla: 'kaka', surf: 'ins'},
        {nada: '8', bla: 'kaka', surf: 'ins'},
        {nada: '9', bla: 'kaka', surf: 'ins'},
        {nada: '10', bla: 'kaka', surf: 'ins'},
        {nada: '11', bla: 'kaka', surf: 'ins'},
        {nada: '12', bla: 'kaka', surf: 'ins'},
        {nada: '13', bla: 'kaka', surf: 'ins'},
        {nada: '14', bla: 'kaka', surf: 'ins'},
        {nada: '15', bla: 'kaka', surf: 'ins'},
        {nada: '16', bla: 'kaka', surf: 'ins'},
        {nada: '17', bla: 'kaka', surf: 'ins'},
        {nada: '18', bla: 'kaka', surf: 'ins'},
        {nada: '19', bla: 'kaka', surf: 'ins'},
        {nada: '20', bla: 'kaka', surf: 'ins'},
        {nada: '21', bla: 'kaka', surf: 'ins'},
        {nada: '22', bla: 'kaka', surf: 'ins'},
        {nada: '23', bla: 'kaka', surf: 'ins'},
        {nada: '24', bla: 'kaka', surf: 'ins'},
        {nada: '25', bla: 'kaka', surf: 'ins'},
        {nada: '26', bla: 'kaka', surf: 'ins'},
        {nada: '27', bla: 'kaka', surf: 'ins'},
        {nada: '28', bla: 'kaka', surf: 'ins'},
        {nada: '29', bla: 'kaka', surf: 'ins'},
        {nada: '30', bla: 'kaka', surf: 'ins'},
        {nada: '31', bla: 'kaka', surf: 'ins'},
        {nada: '32', bla: 'kaka', surf: 'ins'},
        {nada: '33', bla: 'kaka', surf: 'ins'},
        {nada: '34', bla: 'kaka', surf: 'ins'},
        {nada: '35', bla: 'kaka', surf: 'ins'},
        {nada: '36', bla: 'kaka', surf: 'ins'},
        {nada: '37', bla: 'kaka', surf: 'ins'},
        {nada: '38', bla: 'kaka', surf: 'ins'},
        {nada: '39', bla: 'kaka', surf: 'ins'},
        {nada: '40', bla: 'kaka', surf: 'ins'},
        {nada: '41', bla: 'kaka', surf: 'ins'},
        {nada: '42', bla: 'kaka', surf: 'ins'},
        {nada: '43', bla: 'kaka', surf: 'ins'}
      ]

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

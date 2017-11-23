import { ItemsComponent } from './items/items.component';
import { Routes, RouterModule } from '@angular/router';
import { RecentTransacsComponent } from 'app/recent-transacs/recent-transacs.component';
import { RecordTransacsComponent } from 'app/record-transacs/record-transacs.component';
import { StatisticsComponent } from 'app/statistics/statistics.component';
import { TestComponentComponent } from 'app/test-component/test-component.component';
import { StockComponent } from 'app/items/stock/stock.component';
import { SuppliersComponent } from 'app/suppliers/suppliers.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/stats', pathMatch: 'full' },
    { path: 'transactions', component: RecentTransacsComponent },
    { path: 'record', component: RecordTransacsComponent },
    { path: 'stats', component: StatisticsComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'test', component: TestComponentComponent },
    { path: 'stock', component: StockComponent },
    { path: 'suppliers', component: SuppliersComponent }
];

export const AppRouterModule = RouterModule.forRoot(APP_ROUTES);

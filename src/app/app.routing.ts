import { ItemsComponent } from './items/items.component';
import { Routes, RouterModule } from '@angular/router';
import { RecentTransacsComponent } from 'app/recent-transacs/recent-transacs.component';
import { RecordTransacsComponent } from 'app/record-transacs/record-transacs.component';
import { StatisticsComponent } from 'app/statistics/statistics.component';
import { StockComponent } from 'app/items/stock/stock.component';
import { DailyStatsComponent } from 'app/statistics/daily-stats/daily-stats.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/record', pathMatch: 'full' },
    { path: 'transactions', component: RecentTransacsComponent },
    { path: 'record', component: RecordTransacsComponent },
    {
        path: 'stats',
        component: StatisticsComponent,
        children: [{
            path: ':year/:month/:day',
            component: DailyStatsComponent,
        }]
    },
    { path: 'stats', component: StatisticsComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'stock', component: StockComponent },
];

export const AppRouterModule = RouterModule.forRoot(APP_ROUTES);

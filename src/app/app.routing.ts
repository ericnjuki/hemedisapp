import { Routes, RouterModule } from '@angular/router';
import { RecentTransacsComponent } from 'app/recent-transacs/recent-transacs.component';
import { RecordTransacsComponent } from 'app/record-transacs/record-transacs.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/transactions', pathMatch: 'full' },
    { path: 'transactions', component: RecentTransacsComponent },
    { path: 'record', component: RecordTransacsComponent }
    // { path: 'slots', component: SlotMachineListComponent }
];

export const AppRouterModule = RouterModule.forRoot(APP_ROUTES);

import { Routes, RouterModule } from '@angular/router';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    // { path: 'users', component: UserListComponent },
    // { path: 'slots', component: SlotMachineListComponent }
];

export const AppRouterModule = RouterModule.forRoot(APP_ROUTES);

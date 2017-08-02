import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "app/user-list/user-list.component";
import { SlotMachineListComponent } from "app/slot-machine-list/slot-machine-list.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'users', component: UserListComponent },
    { path: 'slots', component: SlotMachineListComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
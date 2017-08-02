import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav.component';
import { UserListComponent } from './user-list/user-list.component';
import { SlotMachineListComponent } from './slot-machine-list/slot-machine-list.component';
import { routing } from "app/app.routing";
import { UserService } from "app/users.service";


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    UserListComponent,
    SlotMachineListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

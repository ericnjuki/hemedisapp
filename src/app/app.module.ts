import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SidenavComponent } from './side-nav/sidenav.component';
import { AppRouterModule } from 'app/app.routing';
import { RecentTransacsComponent } from './recent-transacs/recent-transacs.component';
import { TransactionPillComponent } from './recent-transacs/transaction-pill/transaction-pill.component';
import { RecordTransacsComponent } from './record-transacs/record-transacs.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TransactionService } from 'app/services/transacs.service';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    RecentTransacsComponent,
    TransactionPillComponent,
    RecordTransacsComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule
  ],
  providers: [TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }

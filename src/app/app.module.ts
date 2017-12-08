import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from 'app/app.routing';

// ng-pos components
import { AppComponent } from './app.component';
import { SidenavComponent } from './side-nav/sidenav.component';
import { RecentTransacsComponent } from './recent-transacs/recent-transacs.component';
import { TransactionPillComponent } from './recent-transacs/transaction-pill/transaction-pill.component';
import { RecordTransacsComponent } from './record-transacs/record-transacs.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TransactionService } from 'app/services/transacs.service';
import { AutoCompleteDirective } from 'app/directives/autocomplete.directive';
import { ItemService } from 'app/services/items.service';
import { ItemsComponent } from './items/items.component';
import { StockComponent } from './items/stock/stock.component';

// angular material components
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule } from '@angular/material';

// other components
import { ToastyModule } from 'ng2-toasty';
import { NpModalComponent } from './np-modal/np-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    RecentTransacsComponent,
    TransactionPillComponent,
    RecordTransacsComponent,
    StatisticsComponent,
    AutoCompleteDirective,
    ItemsComponent,
    StockComponent,
    NpModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    MatTableModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSortModule,
    ToastyModule.forRoot(),
  ],
  providers: [TransactionService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }


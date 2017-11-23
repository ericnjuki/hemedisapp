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
import { AutoCompleteDirective } from 'app/directives/autocomplete.directive';
import { ItemService } from 'app/services/items.service';
import { ItemsComponent } from './items/items.component';
import { TestDirectiveDirective } from './directives/test-directive.directive';
import { TestComponentComponent } from './test-component/test-component.component';
import { StockComponent } from './items/stock/stock.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

// angular material components
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule } from '@angular/material';


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
    TestDirectiveDirective,
    TestComponentComponent,
    StockComponent,
    SuppliersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [TransactionService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }


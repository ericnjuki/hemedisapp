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
import { AutoCompleteDirective } from "app/directives/autocomplete.directive";
import { ItemService } from "app/services/items.service";
import { ItemsComponent } from './items/items.component';
import { TestDirectiveDirective } from './directives/test-directive.directive';
import { TestComponentComponent } from './test-component/test-component.component';


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
    TestComponentComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule
  ],
  providers: [TransactionService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }


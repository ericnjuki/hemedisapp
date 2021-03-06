import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from 'app/app.routing';
// import { NgRedux, NgReduxModule } from '@angular-redux/store';
// import { combineReducers } from 'redux';

// ng-pos components
import { NpErrorHandler } from './shared/error handlers/np.handler';
import { HttpInterceptor } from './shared/error handlers/interceptor.http';
import { TransactionService } from 'app/services/transacs.service';
import { ItemService } from 'app/services/items.service';
import { AppComponent } from './app.component';
import { SidenavComponent } from './side-nav/sidenav.component';
import { RecentTransacsComponent } from './recent-transacs/recent-transacs.component';
import { RecordTransacsComponent } from './record-transacs/record-transacs.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ItemsComponent } from './items/items.component';
import { StockComponent } from './items/stock/stock.component';
import { NpModalComponent } from './np-modal/np-modal.component';

// angular material components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

// other components
import { ToastyModule } from 'ng2-toasty';
import { NpGridComponent } from './np-grid/np-grid.component';
import { BatchAddComponent } from './batch-add/batch-add.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    RecentTransacsComponent,
    RecordTransacsComponent,
    StatisticsComponent,
    ItemsComponent,
    StockComponent,
    NpModalComponent,
    NpGridComponent,
    BatchAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    BrowserAnimationsModule,
    MatCardModule,
    ToastyModule.forRoot(),
  ],
  providers: [HttpInterceptor, TransactionService, ItemService, {provide: ErrorHandler, useClass: NpErrorHandler}],
  bootstrap: [AppComponent]
})
export class AppModule {}




import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { ThreadDetailsComponent } from './components/thread-details/thread-details.component';
import { ThreadListComponent } from './components/thread-list/thread-list.component';
import { DiscussionsRoutingModule } from './discussions-routing.module'
import { ShareModule } from '@ngx-share/core';
import { HttpClientModule } from '@angular/common/http';
import { LaddaModule } from 'angular2-ladda';


// Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortByDatePipe } from './pipes/sort-thread-reply/sort-by-date.pipe';

// Modules

import { SuiModule } from 'ng2-semantic-ui';
//import { DashboardRoutingModule } from './dashboard-routing.module';
// Custome component(s) and services
import { DiscussionsApiservice } from './services/discussions.service';

// SB core and shared services
import { SearchService } from '@sunbird/core';
// import { SharedModule } from '@sunbird/shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SuiModule,
    LaddaModule.forRoot({
        style: "contract",
        spinnerSize: 40,
        spinnerColor: "red",
        spinnerLines: 12
    }),
    DiscussionsRoutingModule,
    HttpClientModule,       // for share counts
   // HttpClientJsonpModule,  // for linkedin and tumblr share counts
    ShareModule.forRoot()
  ],
  declarations: [CreateThreadComponent, ThreadDetailsComponent,ThreadListComponent, SortByDatePipe],
  exports: [],
  providers: [
    DiscussionsApiservice
   ]
})
export class DiscussionsModule { }

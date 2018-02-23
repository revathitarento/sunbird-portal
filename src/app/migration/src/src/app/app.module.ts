import { BadgesService } from './services/badges/badges.service';
import { AppCommonModule } from './modules/common/common.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AnnouncementService } from './services/announcement/announcement.service';
import { ContentService } from './services/content/content.service';
import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { SearchComponent } from './components/header/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService } from './services/resource/resource.service';
import { MainHeaderComponent } from './components/header/main-header/main-header.component';
import { MainMenuComponent } from './components/header/main-menu/main-menu.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { LearnerService } from './services/learner/learner.service';
import { CommonModule } from '@angular/common';
import { ThreadDetailsComponent } from '../app/modules/common/components/discussions/thread-details/thread-details.component';
import { ThreadListComponent } from '../app/modules/common/components/discussions/thread-list/thread-list.component';
import { CreateThreadComponent } from '../app/modules/common/components/discussions/create-thread/create-thread.component';
import { DiscussionsApiservice } from './services/discussions/discussions.service';
import {FormsModule} from '@angular/forms';
import { SortByDatePipe} from '../app/modules/common/components/discussions/sort-by-date.pipe'


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    AuthGuardComponent,
    ThreadListComponent,
    ThreadDetailsComponent,
    CreateThreadComponent,
    SortByDatePipe,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule,
    ProfileModule,
    AppCommonModule,
    FormsModule
  ],
  providers: [
    RouteResolveService,
    UserService,
    PermissionService,
    AuthGuard,
    ResourceService,
    LearnerService,
    ContentService,
    AnnouncementService,
    BadgesService,
    DiscussionsApiservice,
    {
      provide: 'USER_ID',
      useFactory: ( ) => {
        return (<HTMLInputElement>document.getElementById('userId')).value;
      }
    }
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}

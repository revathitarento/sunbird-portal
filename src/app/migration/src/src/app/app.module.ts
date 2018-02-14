import { AnnouncementService } from './services/announcement/announcement.service';
import { ContentService } from './services/content/content.service';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { AppLoaderComponent } from './components/common/app-loader/app-loader.component';
import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { ThreadListComponent } from './components/discussions/thread-list/thread-list.component';
import { ThreadDetailsComponent } from './components/discussions/thread-details/thread-details.component';
import { CreateThreadComponent } from './components/discussions/create-thread/create-thread.component';
import { DiscussionsApiservice } from './services/discussions/discussions.service';
//import { DataService } from './components/discussions/data.service';
import { SearchComponent } from './components/header/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { SuiModule } from 'ng2-semantic-ui';
import { PermissionDirective } from './directives/permission.directive';
import { ResourceService } from './services/resource/resource.service';
import { MainHeaderComponent } from './components/header/main-header/main-header.component';
import { MainMenuComponent } from './components/header/main-menu/main-menu.component';
import { ProfileHeaderComponent } from './components/profile/profile-header/profile-header.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { LearnerService } from './services/learner/learner.service';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    ThreadListComponent,
    ThreadDetailsComponent,
    CreateThreadComponent,
    CreateThreadComponent,
    AuthGuardComponent,
    PermissionDirective,
    ProfileComponent,
    AppLoaderComponent,
    ProfileHeaderComponent,
    ProfileViewComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule
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
    DiscussionsApiservice
  ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './header/main-header/main-header.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { SearchComponent } from './header/search/search.component';
import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { DropDownDirective } from './directive/drop-down.directive';
import { Routes, RouterModule } from '@angular/router';
import { routing }        from './app.routing';
import { ProfileComponent } from './main-view/profile/profile.component';
import {HttpClientModule} from '@angular/common/http';
import { ProfileService } from './services/profile.service';
import { PermissionService } from './services/permission.service';
@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    DropDownDirective,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule
  ],
  providers: [
    ProfileService,
    PermissionService
  ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
  }
}

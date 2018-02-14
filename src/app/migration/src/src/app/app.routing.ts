import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { ThreadListComponent } from './components/discussions/thread-list/thread-list.component';
import { ThreadDetailsComponent } from './components/discussions/thread-details/thread-details.component';
import { CreateThreadComponent } from './components/discussions/create-thread/create-thread.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { AuthGuard } from './auth-guards/auth-guard.service';


const appRoutes: Routes = [
    {
        path: 'migration/groups',
        component: CommunityListComponent,
        canActivate: [
            'CanActivate',
        ]
    },
    {
        path: 'migration/profile',
        component: ProfileComponent
    },
    {
        path: 'migration/auth',
        component: AuthGuardComponent,
        resolve: {
            profile: RouteResolveService
        },
        canActivate: [
            AuthGuard,
        ],
        data: {
            breadcrumb: ['Home', 'auth']
        }
    },
    // {
    //    path: 'migration/discussions',
    //     component: DiscussionsComponent,
    //      canActivate: [
    //         'CanActivate',
    //     ]
    // }
    { path: 'migration/thread-list', component: ThreadListComponent, canActivate: ['CanActivate'] },
   { path: 'migration/thread-details', component: ThreadDetailsComponent, canActivate: ['CanActivate'] },
   { path: 'migration/create-thread', component: CreateThreadComponent, canActivate: ['CanActivate'] }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [
    RouteResolveService,
    {
      provide: 'CanActivate',
      useValue: ( ) => {
        return true;
      }
    }
  ]
})
export class AppRoutingModule { }

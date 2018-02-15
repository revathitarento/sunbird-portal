import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { ThreadDetailsComponent } from './components/discussions/thread-details/thread-details.component';
import { ThreadListComponent } from './components/discussions/thread-list/thread-list.component';
import { CreateThreadComponent } from './components/discussions/create-thread/create-thread.component';
import { DiscussionsApiservice } from './services/discussions/discussions.service';
// import {DiscussionsComponent} from './components/discussions/discussions.component';


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
    //     path: 'migration/discussions', component: ThreadListComponent, children: [
    //         { path: '', redirectTo: 'thread-list', pathMatch: 'full' },
    //         { path: 'thread-list', component: ThreadListComponent },
    //         { path: 'thread-details', component: ThreadDetailsComponent },
    //         { path: 'create-thread', component: CreateThreadComponent }
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
        DiscussionsApiservice,
        {
            provide: 'CanActivate',
            useValue: () => {
                return true;
            }
        }
    ]
})
export class AppRoutingModule { }

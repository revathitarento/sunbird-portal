import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { ThreadDetailsComponent } from './modules/common/components/discussions/thread-details/thread-details.component';
import { ThreadListComponent } from './modules/common/components/discussions/thread-list/thread-list.component';
import { CreateThreadComponent } from './modules/common/components/discussions/create-thread/create-thread.component';
import { DiscussionsApiservice } from './services/discussions/discussions.service';

const appRoutes: Routes = [
    {
        path: 'migration/groups',
        component: CommunityListComponent,
        canActivate: [
            'CanActivate',
        ]
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
    { path: 'migration/thread-list/:id', component: ThreadListComponent, canActivate: ['CanActivate'] },
    { path: 'migration/thread-details/:threadId', component: ThreadDetailsComponent, canActivate: ['CanActivate'] },
    { path: 'migration/create-thread/:id', component: CreateThreadComponent, canActivate: ['CanActivate'] }
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

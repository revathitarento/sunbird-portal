import { ProfileComponent } from './main-view/profile/profile.component';
import { Routes, RouterModule } from '@angular/router';

import { CommunityListComponent } from './main-view/community-list/community-list.component';

const appRoutes: Routes = [
    { path: 'migration/groups', component: CommunityListComponent }, // canActivate: [AuthGuard]
    { path: 'migration/profile', component: ProfileComponent }
    // ,{ path:'**', redirectTo: "/public/#!/"}
];

export const routing = RouterModule.forRoot(appRoutes);

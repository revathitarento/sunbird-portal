import { ThreadListComponent } from './components/thread-list/thread-list.component';
import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { ThreadDetailsComponent } from './components/thread-details/thread-details.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'create-thread/:batchId', component: CreateThreadComponent
  },
  {
    path: 'thread-list/:id', component: ThreadListComponent
  },
  {
    path: 'thread-details/:id', component: ThreadDetailsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussionsRoutingModule { }

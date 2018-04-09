import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, CreateTextbookComponent, CreateUploadContentComponent, CreateStudyMaterialComponent,
  CreateCourseComponent, CreateCollectionComponent, CreateLessonPlanComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent
} from './components';

import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      {
        path: 'create', component: CreateContentComponent,
        children: [
          { path: 'textbook', component: CreateTextbookComponent },
          // { path: 'uploadcontent', component: CreateUploadContentComponent },
          { path: 'course', component: CreateCourseComponent },
          { path: 'studymaterial', component: CreateStudyMaterialComponent },
          { path: 'collection', component: CreateCollectionComponent },
          { path: 'lessonplan', component: CreateLessonPlanComponent }
        ]
      },
      {path: 'edit/collection/:contentId/:type/:state/:framework', component: CollectionEditorComponent },
      {path: 'edit/contentEditor/:contentId/:state', component: ContentEditorComponent },
      {path: 'edit/generic', component: GenericEditorComponent },
      { path: 'draft/:pageNumber', component: DraftComponent },
      { path: 'review/:pageNumber', component: ReviewSubmissionsComponent },
      { path: 'published/:pageNumber', component: PublishedComponent },
      // { path: 'uploaded/:pageNumber', component: UploadedComponent },
      { path: '**', redirectTo: 'create' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    RouterModule.forRoot(
      routes,
    { enableTracing: true } // <-- debugging purposes only
  )],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }



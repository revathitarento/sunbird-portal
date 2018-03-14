import { Component, OnInit } from '@angular/core';
import { CreateThreadComponent } from './create-thread.component';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Http } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LaddaModule } from 'angular2-ladda';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as mockData from './create-thread.component.spec.data';

describe('CreateThreadComponent', () => {
   let component: CreateThreadComponent;
   let fixture: ComponentFixture<CreateThreadComponent>;
   let router: Router;
   const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
   class RouterStub {
       navigate = jasmine.createSpy('navigate');
   }

   beforeEach(async(() => {
       TestBed.configureTestingModule({
           imports: [FormsModule, RouterTestingModule, HttpClientTestingModule, HttpClientModule, RouterModule, Ng2IziToastModule],
           declarations: [CreateThreadComponent],
           providers: [ResourceService, ConfigService, DiscussionsApiservice, ToasterService,
               { provide: Router },
               { provide: ActivatedRoute },
               { provide: Router, useClass: RouterStub },
               { provide: ActivatedRoute, useValue: fakeActivatedRoute }],

           schemas: [NO_ERRORS_SCHEMA]
       })
           .compileComponents();
   }));

   beforeEach(() => {
       fixture = TestBed.createComponent(CreateThreadComponent);
       component = fixture.componentInstance;
   });

   it('should create', () => {
       expect(component).toBeTruthy();
   });
   // xit('Go to thread with id 55', () => {
   //     expect(component).toBeTruthy();
   //     component.onCreateThread();
   // });

   // it('should parse api response', inject([DiscussionsApiservice], (service: DiscussionsApiservice, ToasterService, ResourceService,
   //     HttpClient, ConfigService) => {
   //     spyOn(service, 'postThread').and.callFake(() => Observable.of(mockData.mockRes.successData));
   //     const batchId = '0124543621061672965';
   //     const model = {
   //         title: 'new title',
   //         body: 'new description',
   //         contextId: batchId,
   //         contextType: 'batch',
   //         type: 'qna',
   //         config: { upVote: true, downVote: false, flag: false, acceptAnswer: true }
   //     }
   //     service.postThread(this.batchId, model).subscribe(
   //         threadListResponse => {
   //             component.result = threadListResponse;
   //         }
   //     );
   //     fixture.detectChanges();
   //     expect(component.result).toBeDefined();
   //     // expect(component.batchId).toEqual('0124543621061672965');
   // }));
   // When search api's throw's error
   // it('should throw error', inject([DiscussionsApiservice, ToasterService], (service: DiscussionsApiservice, toasterService, http, routerNavigationService) => {
   //   spyOn(service, 'getThreads').and.callFake(() => Observable.throw({}));
   //   fixture.detectChanges();
   //   expect(component.result.length).toBeLessThanOrEqual(0);
   //   expect(component.result.length).toEqual(0);
   //   spyOn(toasterService, 'error').and.callThrough();
   // }));
});
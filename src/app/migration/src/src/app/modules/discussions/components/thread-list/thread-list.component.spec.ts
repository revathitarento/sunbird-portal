import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DiscussionsApiservice } from './../../services/discussions.service';

import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { ThreadListComponent } from './thread-list.component';
import * as mockData from './thread-list.component.spec.data';

describe('ThreadListComponent', () => {
  let component: ThreadListComponent;
  let fixture: ComponentFixture<ThreadListComponent>;
  let router: Router;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'threadId': 55 }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterModule, Ng2IziToastModule, RouterTestingModule.withRoutes([])],
      declarations: [ThreadListComponent, SortByDatePipe],
      providers: [ResourceService, ConfigService, DiscussionsApiservice, ToasterService,

        { provide: Router, useValue: router },
        { provide: ActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],

      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    //  component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  xit('Go to thread with id 55', () => {
    expect(component).toBeTruthy();
    component.gotoThread(55);
  });
  it('On Archive thread id 55 and false state', () => {
    expect(component).toBeTruthy();
    component.onArchive(55, false);
  });
  
  it('On Lock thread id 55', () => {
    expect(component).toBeTruthy();
    component.onLock(55);
  });

  it('should parse api response', inject([DiscussionsApiservice], (service: DiscussionsApiservice, ToasterService, ResourceService,
    HttpClient, ConfigService) => {
    spyOn(service, 'getThreads').and.callFake(() => Observable.of(mockData.mockRes.successData));
    //component.displayThreads();

    const batchId = '0124543621061672965';
    service.getThreads(this.batchId).subscribe(
      threadListResponse => {
        component.result = threadListResponse.result.threads;
      }
    );
    fixture.detectChanges();
    expect(component.result).toBeDefined();
    // expect(component.batchId).toEqual('0124543621061672965');
  }));

  // When search api's throw's error
  it('should throw error', inject([DiscussionsApiservice, ToasterService], (service: DiscussionsApiservice, toasterService, http, routerNavigationService) => {
    spyOn(service, 'getThreads').and.callFake(() => Observable.throw({}));
    fixture.detectChanges();
    expect(component.result.length).toBeLessThanOrEqual(0);
    expect(component.result.length).toEqual(0);
    spyOn(toasterService, 'error').and.callThrough();
  }));


  // When Thread list api's return response
  it('should call thread list api and return valid response', inject([DiscussionsApiservice],
    (DiscussionsApiservice, oasterService, http) => {
      spyOn(DiscussionsApiservice, 'getThreads').and.callFake(() => Observable.of(mockData.mockRes.successData));
      component.displayThreads();
      fixture.detectChanges();
      expect(component.result.length).toBeGreaterThan(1);
      expect(component.result.length).toBeGreaterThanOrEqual(1);
      expect(component.loading).toEqual(false);
    }));

  // it('should call create thread route', inject([Router], (route) => {
  //   component.batchId = '0124543621061672965';
  //   const threadId = 55; 
  //   spyOn(component, 'gotoThread').and.callThrough();
  //   fixture.detectChanges();
  //   expect(route.navigate).toHaveBeenCalledWith(['/thread-details/', threadId]);
  // }));

  it('should navigate', inject([Router],
    (route) => {
      let component = fixture.componentInstance;
      //let navigateSpy = spyOn((<any>component).router, 'navigate');
      const threadId = 55;
      // const params = { threadId: 55 };
      component.gotoThread(55);
      expect(component.threadId).toBe(component.threadId);
      expect(route.navigate).toHaveBeenCalledWith(['/thread-details', threadId]);
      //  expect(route.navigate).toHaveBeenCalledWith(['announcement/outbox's, component.pageNumber]);
    }));
});


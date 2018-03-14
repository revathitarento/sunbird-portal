import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { ThreadListComponent } from './thread-list.component';
import * as mockData from './thread-list.component.spec.data';

describe('ThreadListComponent', () => {
  let component: ThreadListComponent;
  let fixture: ComponentFixture<ThreadListComponent>;
  let router: Router;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterModule, Ng2IziToastModule],
      declarations: [ThreadListComponent, SortByDatePipe],
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

  it('should parse api response', inject([DiscussionsApiservice], (service: DiscussionsApiservice, ToasterService, ResourceService,
    HttpClient, ConfigService) => {
    spyOn(service, 'getThreads').and.callFake(() => Observable.of(mockData.mockRes.successData));
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
  // it('should throw error', inject([DiscussionsApiservice, ToasterService], (service: DiscussionsApiservice, toasterService, http, routerNavigationService) => {
  //   spyOn(service, 'getThreads').and.callFake(() => Observable.throw({}));
  //   fixture.detectChanges();
  //   expect(component.result.length).toBeLessThanOrEqual(0);
  //   expect(component.result.length).toEqual(0);
  //   spyOn(toasterService, 'error').and.callThrough();
  // }));
});


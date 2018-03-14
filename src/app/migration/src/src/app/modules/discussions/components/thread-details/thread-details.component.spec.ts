import { ActivatedRoute, RouterModule, Router } from '@angular/router';;
import { Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LaddaModule } from 'angular2-ladda';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscussionsApiservice } from './../../services/discussions.service';


import { ThreadDetailsComponent } from './thread-details.component';


import { ClipboardModule } from 'ngx-clipboard';


import { DiscussionsObject } from './../../interfaces/discussions.interface';
import { replyObject } from './../../interfaces/reply.interface';

import { DOCUMENT } from '@angular/platform-browser';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import * as mockData from './thread-details.component.spec.data';

describe('ThreadDetailsComponent', () => {
    let component: ThreadDetailsComponent;
    let fixture: ComponentFixture<ThreadDetailsComponent>;
    let router: Router;
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }
    const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThreadDetailsComponent, SortByDatePipe],
            imports: [HttpClientTestingModule, HttpClientModule, RouterModule, Ng2IziToastModule, RouterTestingModule.withRoutes([]),
                FormsModule,
                RouterTestingModule,
                ClipboardModule,   
                LaddaModule.forRoot({
                    spinnerSize: 35,
                    spinnerColor: 'grey',
                    spinnerLines: 12
                })],
            providers: [DiscussionsApiservice, HttpClientModule, Http, ConfigService, ToasterService, ResourceService,
                { provide: Router, useValue: router },
        { provide: ActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
               ],
            
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ThreadDetailsComponent);
        component = fixture.componentInstance;
      //  fixture.detectChanges();
    });

    
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    
      it('should parse api response', inject([DiscussionsApiservice], (service: DiscussionsApiservice, ToasterService, ResourceService,
        HttpClient, ConfigService) => {
        spyOn(service, 'getThreadbyId').and.callFake(() => Observable.of(mockData.mockRes.successData));
        //component.displayThreads();
    
        const threadId = 55;
        service.getThreadbyId(threadId).subscribe(
          threadListResponse => {
            component.threadDetails = threadListResponse.result.threads;
          }
        );
        fixture.detectChanges();
        expect(component.threadDetails).toBeDefined();
        
      }));
  
  
});

import { ActivatedRoute, RouterModule, Router } from '@angular/router';;
//import { Http } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ThreadDetailsComponent } from './thread-details.component';
import { LaddaModule } from 'angular2-ladda';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { ClipboardModule } from 'ngx-clipboard';

import { SuiModule } from 'ng2-semantic-ui';

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
    const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 55, 'timePeriod': '7d' }]) };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThreadDetailsComponent, SortByDatePipe],
            imports: [HttpClientTestingModule, HttpClientModule, RouterModule, Ng2IziToastModule,SuiModule, RouterTestingModule.withRoutes([]),
                FormsModule,
                RouterTestingModule,
                ClipboardModule,
                LaddaModule.forRoot({
                    spinnerSize: 35,
                    spinnerColor: 'grey',
                    spinnerLines: 12
                })],
            providers: [DiscussionsApiservice, HttpClientModule, ConfigService, ToasterService, ResourceService,
                //         { provide: Router, useValue: router },
                // { provide: ActivatedRoute },
                // { provide: Router, useClass: RouterStub },
                // { provide: ActivatedRoute, useValue: fakeActivatedRoute }
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

    it('should parse thread details api response', inject([DiscussionsApiservice], (service: DiscussionsApiservice, ToasterService, ResourceService,
        HttpClient, ConfigService) => {
        spyOn(service, 'getThreadbyId').and.callFake(() => Observable.of(mockData.mockRes.successData));


        const threadId = 55;
        service.getThreadbyId(threadId).subscribe(
            threadDetailsResponse => {
                component.loading = false;
                component.dataResult = threadDetailsResponse;
                component.threadDetails = threadDetailsResponse.result.threads;


                expect(component.dataResult.params.status).toBe('successful');

            }
        );
        fixture.detectChanges();
        expect(component.threadDetails).toBeDefined();

    }));


    it('should call archive action api and get success response', inject([DiscussionsApiservice], (service: DiscussionsApiservice) => {
        spyOn(service, 'archiveAction').and.callFake(() => Observable.of(mockData.mockRes.threadArchive));
        component.onArchive('55',true);
        const id = '55';
        service.archiveAction(id).subscribe(
                archiveResponse => {
                component.dataResult = archiveResponse.result;
                component.dataResult.status = archiveResponse.result.status;
              //  expect(archiveResponse.params.status).toBe('done');
            }
        );
        fixture.detectChanges();
       // expect(component.threadDetails.thread.archived).toBe(true);
        // expect(component.pageNumber).toBe(1);
        // expect(component.pageLimit).toBe(5);
        // expect(component.outboxData.count).toBe(1173);
    }));






    xit('should call thread details api and get error response', inject([DiscussionsApiservice, ToasterService, ResourceService,
         ConfigService],
        (service: DiscussionsApiservice, toasterService, resourceService, HttpClient, configService) => {
            spyOn(service, 'getThreadbyId').and.callFake(() => Observable.throw(mockData.mockRes.threadDetailsError));
          //  spyOn(resourceService, 'getResource').and.callThrough();
            spyOn(toasterService, 'error').and.callThrough();

            const threadId = 55;
            service.getThreadbyId(this.threadId).subscribe(
                threadDetailsResponse => { },
                err => {
                     console.log("error params", err.error.params);
                    // expect(err.error.params.errmsg).toBe('Cannot set property of undefined');
                    // expect(err.error.params.status).toBe('failed');
                    expect(err.error.responseCode).toBe('CLIENT_ERROR');
                   // expect(component.loading).toBe(false);
                }
            );
            fixture.detectChanges();

        }));

});



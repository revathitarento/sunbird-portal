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
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { ThreadDetailsComponent } from './thread-details.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize } from "ng2-semantic-ui";

// import * as mockData from './thread-list.component.spec.data';
describe('ThreadDetailsComponent', () => {
    let component: ThreadDetailsComponent;
    let fixture: ComponentFixture<ThreadDetailsComponent>;
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }
    const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThreadDetailsComponent,
                SortByDatePipe],
            imports: [HttpClientTestingModule,
                SuiModule,
                FormsModule, RouterTestingModule,
                ClipboardModule,
                Ng2IziToastModule,
                FormsModule,
                RouterTestingModule,
                LaddaModule.forRoot({
                    spinnerSize: 35,
                    spinnerColor: 'grey',
                    spinnerLines: 12
                })],
            providers: [SuiModalService, ResourceService, ConfigService, DiscussionsApiservice, ToasterService,
                { provide: Router },
                { provide: ActivatedRoute },
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute }],

            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ThreadDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    // it('should create', inject([DiscussionsApiservice], (discussionsApiservice) => {
    //     expect(component).toBeTruthy();
    //     component.changeWidget();
    //     const mockResponse = {};
    //     spyOn(discussionsApiservice, 'postThread').and.callFake(() => Observable.of(mockResponse));
    // }));
    it('should change the route', () => {
        expect(component).toBeTruthy();
        component.changeWidget();
    });
});

import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ThreadDetailsComponent } from './thread-details.component';
import { LaddaModule } from 'angular2-ladda';
describe('ThreadDetailsComponent', () => {
    let component: ThreadDetailsComponent;
    let fixture: ComponentFixture<ThreadDetailsComponent>;
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }
    const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThreadDetailsComponent],
            imports: [HttpClientTestingModule,
                FormsModule,
                RouterTestingModule,
                LaddaModule.forRoot({
                    spinnerSize: 35,
                    spinnerColor: 'grey',
                    spinnerLines: 12
                })],
            providers: [DiscussionsApiservice, HttpClientModule, Http]
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

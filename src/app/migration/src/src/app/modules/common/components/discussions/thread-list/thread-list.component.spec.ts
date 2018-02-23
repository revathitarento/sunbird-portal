import { Http } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { ThreadListComponent } from './thread-list.component';



describe('ThreadListComponent', () => {
  let component: ThreadListComponent;
  let fixture: ComponentFixture<ThreadListComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadListComponent],
      imports: [HttpClientTestingModule],
      providers: [DiscussionsApiservice, HttpClientModule, Http,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
    component.displayThreads();
  });
  it('should create', () => {
    expect(component).toBeTruthy();  
    component.createThread();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
    component.gotoThread(25);
  });

  it('should parse api response', inject([DiscussionsApiservice,], (service: DiscussionsApiservice) => {
    const mockResponse = [
     { "id":38,
      "title":"Why is this topic in this course so much interesting?",
      "fancy_title":"Why is this topic in this course so much interesting?",      
      "reply_count":0,      
      "created_at":"2018-02-12T06:52:35.441Z",      
      "unseen":false,      
      "closed":false,      
      "like_count":0,      
      "last_poster_username":"ntptest102",           
      "has_accepted_answer":false    
    },
     { "id":39,
    "title":"Why is this topic in this course so much interesting?",
    "fancy_title":"Why is this topic in this course so much interesting?",      
    "reply_count":0,      
    "created_at":"2018-02-12T06:52:35.441Z",      
    "unseen":false,      
    "closed":false,      
    "like_count":0,      
    "last_poster_username":"ntptest102",           
    "has_accepted_answer":false  
  }]
   
    //spyOn(service, 'getThreads').and.callThrough();
    spyOn(service, 'getThreads').and.callFake(() => Observable.of(mockResponse));
    var response = service.getThreads();
    expect(service).toBeTruthy();
    expect(service.getThreads).not.toBeUndefined()
    expect(service.getThreadbyId).not.toBeUndefined()
    // expect(response.series).not.toBeNull()
    // expect(response.length).toBeGreaterThan(2);
    }));

//   it('should tell ROUTER to navigate when + plus icon clicked',
//   inject([Router], (router: Router) => { // ...

//   const spy = spyOn(router, 'navigateByUrl');

//   createThread(); // trigger click on create Thread

//   // args passed to router.navigateByUrl()
//   const navArgs = spy.calls.first().args[0];

//   // expecting to navigate to create-thread
//   expect(url).toBe('create-thread');
// }));
  
});

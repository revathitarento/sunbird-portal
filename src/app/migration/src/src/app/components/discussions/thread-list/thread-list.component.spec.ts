import {  async, ComponentFixture, TestBed , inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ThreadListComponent } from './thread-list.component';
import {DiscussionsApiservice} from "../../../services/discussions/discussions.service";

// mock the service
class MockDummyService extends DiscussionsApiservice {
  // mock everything used by the component
};
describe('List thread component', () => {
  let component: ThreadListComponent;
  let fixture: ComponentFixture<ThreadListComponent>;
  let apiService: DiscussionsApiservice;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpModule],
      declarations: [ ThreadListComponent ],
      providers: [{
        provide: DiscussionsApiservice    
      },{ provide: XHRBackend, useClass: MockBackend }]
    })
    .compileComponents();
  }));

  describe('getThreads()', () => {

    it('should return an Observable<Array<Threads>>',
        inject([DiscussionsApiservice, XHRBackend], (apiService, mockBackend) => {

        const mockResponse = {
          data: [
            { id: 0, name: 'Thread 0' },
            { id: 1, name: 'Thread 1' },
            { id: 2, name: 'Thread 2' },
            { id: 3, name: 'Thread 3' },
          ]
        };

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        apiService.getThreads().subscribe((response) => {
          expect(response.length).toBe(4);
          expect(response[0].name).toEqual('Thread 0');
          expect(response[1].name).toEqual('Thread 1');
          expect(response[2].name).toEqual('Thread 2');
          expect(response[3].name).toEqual('Thread 3');
        });

    }));
  });

  
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(ThreadListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it(`should create`, async(inject([DiscussionsApiservice],
  //   ( apiService: DiscussionsApiservice) => {
  //     expect(apiService).toBeTruthy();
  // })));
});
// describe('List thread component', () => {

//     let component: ThreadListComponent;
//     let fixture: ComponentFixture<ThreadListComponent>; 
//     let apiService: DiscussionsApiservice;
//     let el: DebugElement;

//     beforeEach(() => {
//       TestBed.configureTestingModule({
//         declarations: [ThreadListComponent],
//         providers: [DiscussionsApiservice]
//       });
 

//     // create component and test fixture
//     fixture = TestBed.createComponent(ThreadListComponent); 

//     // get test component from the fixture
//     component = fixture.componentInstance; 

//     // UserService provided to the TestBed
//     apiService = TestBed.get(DiscussionsApiservice); 

//     el = fixture.debugElement.query(By.css('a'));
//   });

  
//   // it('Displays threads on api call is success via fakeAsync() and tick()', fakeAsync(() => {
//   //   expect(el.nativeElement.textContent.trim()).toBe('');
//   //   fixture.detectChanges();
//   //   //expect(el.nativeElement.textContent.trim()).toBe('Login');

//   //   spyOn(apiService, 'getThreads').and.returnValue(Promise.resolve(true));

//   //   component.ngOnInit();
//   //   // Simulates the passage of time until all pending asynchronous activities complete
//   //   tick();
//   //   fixture.detectChanges();
//   //   //expect(el.nativeElement.textContent.trim()).toBe('Logout');
//   // }));
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });



import {  async, ComponentFixture, TestBed , inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Post } from './models/post.model';
// import {
//   HttpModule,
//   Http,
//   Response,
//   ResponseOptions,
//   XHRBackend
// } from '@angular/http';
//import { MockBackend } from '@angular/http/testing';

//import { By }              from '@angular/platform-browser';
//import { DebugElement }    from '@angular/core';
//import { RouterTestingModule } from '@angular/router/testing';
//import { ThreadListComponent } from './thread-list.component';
import {DiscussionsApiservice} from "./discussions.service";


describe('DiscussionsApiservice', () => {
//   let component: DiscussionsApiservice;
//   let fixture: ComponentFixture<DiscussionsApiservice>;
   let apiService: DiscussionsApiservice;
   let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    //  declarations: [ DiscussionsApiservice ],
      providers: [ DiscussionsApiservice ]
    })
    apiService = TestBed.get(DiscussionsApiservice);
    httpMock = TestBed.get(HttpTestingController);
  });



  it("Should retrieve posts from API via GET",() => {
    const dummyPost: Post[] =  [
                     {  id: 1, title: 'Testing angular', created_at: "2018-02-12" },
                     {  id: 2, title: 'Testing angular 2', created_at: "2018-02-12" },
                     {  id: 3, title: 'Testing angular 3', created_at: "2018-02-12" },
                     {  id: 4, title: 'Testing angular 4', created_at: "2018-02-12" },
                   ];
        apiService.getThreads().subscribe(posts =>{
            expect(posts.length).toBe(4);
            expect(posts).toEqual(dummyPost);
        });
    const request = httpMock.expectOne(`${apiService.baseUrl}/discussions/v1/list/do_212390847580487680138`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyPost);    
        
  });

});
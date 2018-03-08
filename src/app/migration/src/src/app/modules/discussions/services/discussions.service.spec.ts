import {  TestBed , inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Post } from './models/post.model';
import {DiscussionsApiservice} from "./discussions.service";


// describe('DiscussionsApiservice', () => {
//    let apiService: DiscussionsApiservice;
//    let httpMock: HttpTestingController;



//    const dummyPost: Post[] =  [
//     {  id: 1, title: 'Testing angular', created_at: "2018-02-12" },
//     {  id: 2, title: 'Testing angular 2', created_at: "2018-02-12" },
//     {  id: 3, title: 'Testing angular 3', created_at: "2018-02-12" },
//     {  id: 4, title: 'Testing angular 4', created_at: "2018-02-12" },
//   ];

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//     //  declarations: [ DiscussionsApiservice ],
//       providers: [ DiscussionsApiservice ]
//     })
//     apiService = TestBed.get(DiscussionsApiservice);
//     httpMock = TestBed.get(HttpTestingController);
//   });



//   it("Should retrieve posts from API via GET",() => {
   
//         apiService.getThreads().subscribe(posts =>{
//             expect(posts.length).toBe(4);
//             expect(posts).toEqual(dummyPost);
//         });
//     const request = httpMock.expectOne(`${apiService.baseUrl}/discussions/v1/list/do_212390847580487680138`);
//     expect(request.request.method).toBe('GET');
//     request.flush(dummyPost);    
        
//   });

// });
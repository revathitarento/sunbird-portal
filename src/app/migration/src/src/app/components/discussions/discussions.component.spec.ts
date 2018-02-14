import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { ThreadListComponent } from './thread-list/thread-list.component';
import {DiscussionsApiservice} from "../../services/discussions/discussions.service";


describe('Component: Login', () => {

    let component: ThreadListComponent;
    let fixture: ComponentFixture<ThreadListComponent>; 
    let apiService: DiscussionsApiservice;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ThreadListComponent],
        providers: [DiscussionsApiservice]
      });
 

    // create component and test fixture
    fixture = TestBed.createComponent(ThreadListComponent); 

    // get test component from the fixture
    component = fixture.componentInstance; 

    // UserService provided to the TestBed
    apiService = TestBed.get(DiscussionsApiservice); 
  });

  it('Displays the threads when api call is successful', () => {
    spyOn(apiService, 'isAuthenticated').and.returnValue(false);
    expect(component.needsLogin()).toBeTruthy();
    expect(apiService.isAuthenticated).toHaveBeenCalled();
  });
  
  it('Cannot display the threads when api call is failure', () => {
    spyOn(apiService, 'isAuthenticated').and.returnValue(true);
    expect(component.needsLogin()).toBeFalsy();
    expect(apiService.isAuthenticated).toHaveBeenCalled();
  });
  
});



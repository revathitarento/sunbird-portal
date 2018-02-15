import { Http } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DiscussionsApiservice } from './../../../services/discussions/discussions.service';
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
      providers: [DiscussionsApiservice, HttpClientModule, Http]
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
  });

  
});

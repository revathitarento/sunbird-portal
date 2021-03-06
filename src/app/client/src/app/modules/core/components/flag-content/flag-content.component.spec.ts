import { ContentService, PlayerService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { SharedModule , ResourceService, ToasterService} from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlagContentComponent } from './flag-content.component';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from './flag-content.component.spec.data';
describe('FlagContentComponent', () => {
  let component: FlagContentComponent;
  let fixture: ComponentFixture<FlagContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

const fakeActivatedRoute = { parent: { params: Observable.of({contentId: 'testId', contentName: 'hello'}) },
snapshot: {
  parent: {
    url: [
      {
        path: 'play',
      },
      {
        path: 'content',
      },
      {
        path: 'do_112498456959754240121',
      },
    ],
  }
}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [{ provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagContentComponent);
    component = fixture.componentInstance;
  });
  xit('should call get content', () => {
    const playerService = TestBed.get(PlayerService);
    component.contentData = Response.contentData;
    component.getContentData();
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
  });
  xit('should call getContent api when data is not present ', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = {};
    spyOn(playerService, 'getContent').and.callFake(() => Observable.of(Response.successContentData));
    component.getContentData();
    component.contentData.name = Response.contentData.name;
    component.contentData.versionKey = Response.contentData.versionKey;
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
    expect(component.contentData.versionKey).toEqual('1496989757647');
  });
  xit('should call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const modal = '';
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647',
     flagReasons: 'others'
    };
    spyOn(contentService, 'post').and.callFake(() => Observable.of(Response.successFlag));
   component.populateFlagContent(requestData);
   expect(component.showLoader).toBeFalsy();
  });
  xit('should  throw error when call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647'
    };
    spyOn(contentService, 'post').and.callFake(() => Observable.throw({}));
    spyOn(toasterService, 'error').and.callThrough();
   component.populateFlagContent(requestData);
   fixture.detectChanges();
   expect(component.showLoader).toBeFalsy();
   expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0050);
  });
});

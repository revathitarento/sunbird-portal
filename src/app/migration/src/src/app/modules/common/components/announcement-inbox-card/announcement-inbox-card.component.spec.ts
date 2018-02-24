import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {By} from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Import services
import { ResourceService, AnnouncementService } from '../../index';
import { AnnouncementInboxCardComponent } from './announcement-inbox-card.component';
import { DateFormatPipe } from '../../pipes/index';




describe('AnnouncementInboxCardComponent', () => {
  let component: AnnouncementInboxCardComponent;
  let fixture: ComponentFixture<AnnouncementInboxCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule, HttpClientModule ],
      declarations: [ AnnouncementInboxCardComponent, DateFormatPipe],
      providers: [ AnnouncementService, ResourceService ],
      schemas:   [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementInboxCardComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for circular type', () => {
    component.announcement = {
      type: 'circular',
    title: 'abc',
    from: 'for',
    read: false,
    links: ['hello', ''] ,
    description: '',
    attachments: [{'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0124190917418598400.png',
      'mimetype': 'image/png', 'name' : 'ACBuilder css.png', size : '89 KB'},
      {'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-01241909174185657.png',
      'mimetype': 'image/png', 'name' : 'abc css.png', size : '78 KB'}],
    createdDate: '2018-01-15 07:40:11:561+0000'
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .announcementHomeCard-header').innerText).toEqual('abc');
    expect(fixture.nativeElement.querySelector('div .annType').innerText).toEqual('circular');
    expect(fixture.nativeElement.querySelector('div .annOrgName').innerText).toEqual('for');
    expect(fixture.nativeElement.querySelector('div .announcement-description').innerText).toEqual('');
    expect(fixture.nativeElement.querySelector('div.last span.announcement-description').innerText).toEqual('+ 1 more attachment(s)');
    expect(fixture.nativeElement.querySelector('div .annCreatedDate').innerText).toEqual('15th January 2018');
  });

  it('should show TEST INPUT for news type', () => {
    component.announcement = {
      type: 'news',
    title: 'abc',
    from: 'for',
    read: true,
    links: [] ,
    description: 'hi',
    attachments: [{}],
    createdDate: ''
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .annType').innerText).toEqual('news');
    expect(fixture.nativeElement.querySelector('div .annUrlLinks')).toEqual(null);
     expect(fixture.nativeElement.querySelector('div .annAttachment').innerText).toEqual('');
     expect(fixture.nativeElement.querySelector('div .announcement-description').innerText).toEqual('hi');
     expect(fixture.nativeElement.querySelector('div .annCreatedDate').innerText).toEqual('Invalid date');
  });

});


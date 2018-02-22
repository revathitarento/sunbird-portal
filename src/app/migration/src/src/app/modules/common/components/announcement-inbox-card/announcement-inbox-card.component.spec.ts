import { DateFormatPipe } from './../../pipes/date-format.pipe';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
// Import services
import { ResourceService } from '../../../../services/resource/resource.service';
import { AnnouncementService } from '../../../../services/announcement/announcement.service';
import { AnnouncementInboxCardComponent } from './announcement-inbox-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('AnnouncementInboxCardComponent', () => {
  let component: AnnouncementInboxCardComponent;
  let fixture: ComponentFixture<AnnouncementInboxCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule, HttpClientModule ],
      declarations: [ AnnouncementInboxCardComponent, DateFormatPipe],
      providers: [ AnnouncementService, ResourceService ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementInboxCardComponent);
    component = fixture.componentInstance;
    component.item = {
      type: 'circular',
    title: 'abc',
    from: 'for',
    read: true,
    links: ['', ''] ,
    description: 'hi',
    attachments: [{}],
    createdDate: '27th september 2017'
    };
    fixture.detectChanges();
  });

  it('should show TEST INPUT', () => {
    expect(fixture.nativeElement.querySelector('div .announcementHomeCard-header').innerText).toEqual('abc');
    expect(fixture.nativeElement.querySelector('div .annType').innerText).toEqual('circular');
  });

});


import { Component, OnInit } from '@angular/core';
import { RssfeedService } from '../../service';

/**
 * Shows notification
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  rssFeedResearchPapers: any;
 constructor(public rssfeedService: RssfeedService) { }
  ngOnInit() {
   this.getResearchRssFeed();
 }
  getResearchRssFeed() {
   this.rssfeedService.getReasearchPapersRssFeed().subscribe(
     (data) => {
         this.rssFeedResearchPapers = data.result;
      });
 }
}

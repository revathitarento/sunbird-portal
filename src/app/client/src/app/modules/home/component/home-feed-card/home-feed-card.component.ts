import { Component, OnInit } from '@angular/core';
import { RssfeedService } from '../../service/index';

/**
 * Shows news feed
 */
@Component({
  selector: 'app-home-feed-card',
  templateUrl: './home-feed-card.component.html',
  styleUrls: ['./home-feed-card.component.css']
})
export class HomeFeedCardComponent  implements OnInit {
  rssFeedQuestions: any;
  constructor(public rssfeedService: RssfeedService) { }
   ngOnInit() {
    this.getQuestionsRssFeed();
  }
   getQuestionsRssFeed() {
    this.rssfeedService.getQuestionsFeed().subscribe(
      (data) => {
          console.log('rss feed', data.result);
          this.rssFeedQuestions = data.result;
       });
  }

}

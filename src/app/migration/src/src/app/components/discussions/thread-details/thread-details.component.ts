import { Component, OnInit } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router } from '@angular/router';
import { DiscussionsApiservice } from '../../../services/discussions/discussions.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-thread-details',
  templateUrl: './thread-details.component.html',
  styleUrls: ['./thread-details.component.css']
})
export class ThreadDetailsComponent implements OnInit {
  public message: any;
  public successMessage: boolean;
  public discussionsModel = new DiscussionsObject('', '', '');
  constructor(private router: Router, private discussionService: DiscussionsApiservice) {
    this.discussionService.currentMessage.subscribe(message => this.message = message);
   console.log('getting from service', this.message);
  }
  ngOnInit() {
  }
  changeWidget() {
    console.log('inside changeWidget()');
    this.router.navigate(['migration/thread-list']);
  }
  public submitAnswer() {
    this.successMessage = true;
    this.discussionService.postThread(this.discussionsModel).subscribe(data => {
      console.log('data from service', data);
    });
  }
}

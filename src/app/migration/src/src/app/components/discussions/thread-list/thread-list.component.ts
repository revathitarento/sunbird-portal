import { Component, OnInit } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { DiscussionsApiservice } from '../../../services/discussions/discussions.service';
@Component({
    selector: 'app-thread-list',
    templateUrl: './thread-list.component.html',
    styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
    public threads: any;
    public result: any;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private discussionService: DiscussionsApiservice) {
    }
    public displayThreads() {
        this.discussionService.getThreads().subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            console.log('result: ', this.result);
        },
            err => {
                console.log('Error occured in Display threads.');
            });
    }
    ngOnInit(): void {
        this.displayThreads();
    }
    createThread() {
        this.router.navigate(['migration/create-thread']);
    }
    gotoThread(threadId, index) {
        this.router.navigate(['migration/thread-details']);
        console.log('inside gotoThread()', threadId, index, this.result[index]);
        this.discussionService.changeMessage(this.result[index]);
    }
}

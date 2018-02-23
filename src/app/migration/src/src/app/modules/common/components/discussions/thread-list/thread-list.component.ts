import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
@Component({
    selector: 'app-thread-list',
    templateUrl: './thread-list.component.html',
    styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit, OnDestroy {
    public threads: any;
    public result: any;
    public sub: any;
    public id: any;
    public loading: boolean;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) {
    }
    public displayThreads() {
        this.discussionService.getThreads().subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            this.loading = false;
            console.log('result: ', this.result, this.result[0].tags);
            this.id = this.result[0].tags[0];
        },
            err => {
                console.log('Error occured in Display threads.');
            });
    }
    ngOnInit(): void {
        this.displayThreads();
        // this.id = this.result[0].tags;
        this.loading = true;
        this.sub = this.route.params.subscribe(params => {
            console.log('param', params, this.id);
            this.id = params['id'];
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    createThread() {
        this.router.navigate(['migration/create-thread', this.id]);
    }
    gotoThread(threadId) {
        this.router.navigate(['migration/thread-details', threadId]);
        console.log('inside gotoThread()', threadId);
        this.discussionService.changeMessage(threadId);
    }
}

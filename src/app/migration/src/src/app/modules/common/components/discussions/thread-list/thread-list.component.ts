import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { SortByDatePipe } from '../sort-by-date.pipe';

@Component({
    selector: 'app-thread-list',
    templateUrl: './thread-list.component.html',
    styleUrls: ['./thread-list.component.css'],
    providers: [SortByDatePipe]
})
export class ThreadListComponent implements OnInit, OnDestroy {
    public threads: any;
    public result: any;
    public sub: any;
    public id: number;
    public loading: boolean;
    showErrMessage: boolean;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) {
    }
    public displayThreads() {
        this.discussionService.getThreads().subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            console.log('result: ', this.result);
            if (this.result === undefined) {
                this.showErrMessage = true;
            }
            this.loading = false;
        },
            err => {
                this.showErrMessage = true;
                console.log('Error occured in Display threads.');
            });
    }


    ngOnInit(): void {
        this.loading = true;
        this.showErrMessage = false;
        this.displayThreads();
        this.param = "-created_at";
        this.sub = this.route.params.subscribe(params => {
            console.log('param', params);
            this.id = params['id'];
        });

    }
    public msg: any;
    public param: any;

    ascSortClick() {
        this.param = "created_at";
    }
    descSortClick() {
        this.param = "-created_at";
    }
    likeSortClick() {
        this.param = "like_count"
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    createThread() {
        this.router.navigate(['migration/create-thread', this.id]);
    }


    gotoThread(threadId: number) {
        this.router.navigate(['migration/thread-details', threadId]);
        console.log('inside gotoThread()', threadId);
        this.discussionService.changeMessage(threadId);
    }
}

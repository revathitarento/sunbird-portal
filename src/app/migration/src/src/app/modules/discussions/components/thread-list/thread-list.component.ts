import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DiscussionsObject } from './../../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import * as _ from 'lodash';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { DOCUMENT } from '@angular/platform-browser';
import { ResourceService, ToasterService, } from '@sunbird/shared';

@Component({
    selector: 'app-thread-list',
    templateUrl: './thread-list.component.html',
    styleUrls: ['./thread-list.component.css'],
    // providers: [SortByDatePipe]
})
export class ThreadListComponent implements OnInit, OnDestroy {
    /**
 * Reference of resourceService
 */
    public resourceService: ResourceService;

    /**
     * Reference of toaster service
     */
    private toasterService: ToasterService;
    public threads: any;
    public result: Array<any> = [];
    public sub: any;
    public id: number;
    public threadId: number;
    public batchId: any;
    public loading: boolean;
    public msg: any;
    public param: any;
    public query: string;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute,
        private discussionService: DiscussionsApiservice, @Inject(DOCUMENT) document: any, toasterService: ToasterService) {
        this.toasterService = toasterService;
    }
    public displayThreads() {     
        this.discussionService.getThreads(this.batchId).subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            console.log('result: ', this.result);
            if (this.result === undefined) {
                this.toasterService.error("Error in displaying threads");

            }
            this.loading = false;
        },
            err => {
                this.loading = false;
                this.toasterService.error("Error in displaying threads");
            });
    }
    public linkShare() {
        alert('copied');
    }
    ngOnInit(): void {
        this.loading = true;
        this.param = '-createdDate';
        this.sub = this.route.params.subscribe(params => {
            console.log('params', params);
            this.batchId = params['id'];
        });
        this.displayThreads();
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
  
    gotoThread(threadId: number) {
        this.router.navigate(['/thread-details', threadId]);       
        this.discussionService.changeMessage(threadId);
    }

    //On Archive of Thread function
    public archivedState: boolean;
    public index: any;
    public errorData: any;
    public errMsg: string;

    //On Archive of Thread function
    public onArchive(id, state) {
        console.log('inside onArchive()', id, state);
        this.discussionService.archiveAction(id).subscribe(data => {
            console.log("Archive data", data['responseCode']);
            if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
                if (!this.threads.result.archived === true) {
                    this.archivedState = true;
                    this.index = _.findIndex(this.threads.result.threads, { 'id': id });
                    this.toasterService.success("Thread archived successfully");
                }
                else {
                    this.toasterService.error("Thread is already archived ");
                }
            }
        },
            error => {
                this.errorData = error;
                console.log("error", error);
                this.errMsg = this.errorData.error.params.errmsg;
                this.toasterService.error(this.errMsg);
            });
    }


    public lockedState: boolean;
    public lockedId: any;
    public onLock(id) {
        this.lockedState = false;
        console.log('inside onLock', id);
        this.discussionService.lockAction(id).subscribe(data => {
            console.log("locked data", data);
            if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
                if (!this.threads.result.locked === true) {
                    this.lockedId = data['result'].id
                    this.lockedState = true;
                    console.log('lock response', data, this.lockedId, this.lockedState);
                    this.toasterService.success("Locked the thread successfully");
                }
                else {
                    this.toasterService.error("Thread is already locked");
                }
            }
        },
            error => {
                this.errorData = error;
                this.errMsg = this.errorData.error.params.errmsg;
                this.toasterService.error(this.errMsg);
            });
    }
    // public filter() {
    //     this.query = this.result;
    //     if (this.query === '' && this.query.length >= 3) {
    //         this.filteredList = this.result.filter(function (el) {
    //             return el.toLowerCase().indexOf(this.query.toLowerCase());
    //         }.bind(this));
    //     }
    // }
}

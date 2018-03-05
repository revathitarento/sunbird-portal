import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import * as _ from 'lodash';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { SortByDatePipe } from '../sort-by-date.pipe';
import { DOCUMENT } from '@angular/platform-browser';

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
    public msg: any;
    public param: any;
    public baseUrl: string;
    public courseType: string;
    public query: string;
    public filteredList: any;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute,
        private discussionService: DiscussionsApiservice, @Inject(DOCUMENT) document: any) {
        this.baseUrl = 'http://localhost:4200/';
        this.courseType = 'ENROLLED_COURSE';
    }
    public displayThreads() {
        this.discussionService.getThreads(this.id).subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            console.log('result: ', this.result);
            if (this.result === undefined) {
                this.showErrMessage = true;
            }
            this.loading = false;
            // this.id = this.result[0].tags[0];
            // console.log(this.id, this.result[0].tags[0]);
        },
            err => {
                this.loading = false;
                this.showErrMessage = true;
                console.log('Error occured in Display threads.');
            });
    }
    public linkShare() {
        alert('copied');
    }
    ngOnInit(): void {
        this.loading = true;
        this.showErrMessage = false;
        this.displayThreads();
        this.param = '-createdDate';
        this.sub = this.route.params.subscribe(params => {
            console.log('params', params);
            this.id = params['id'];
        });

    }
    ascSortClick() {
        this.param = 'createdDate';
    }
    descSortClick() {
        this.param = '-createdDate';
    }
    likeSortClick() {
        this.param = 'voteCount';
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

    //On Archive of Thread function
    public archivedState : boolean;
    public index : any;
  public onArchive(id, state) {
    console.log('inside onArchive()', id, state);
    this.discussionService.archiveAction(id, state).subscribe(data => {
      console.log("Archive data", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'archived') {
          console.log("this.threads,", this.threads.result.threads);
     this.index = _.findIndex(this.threads.result.threads, { 'id': id });
      if(state === true){
       // this.archivedId = data['result'].id;
        this.archivedState = false;
       // this.threadDetails['thread']['replies'][index]['actions'].archived = 1;
      }
      else{
       // this.archivedId = data['result'].id;
        this.archivedState = data['result'].isUndo;
       // this.threadDetails['thread']['replies'][index]['actions'].archived = 0;
      }  
      } 
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

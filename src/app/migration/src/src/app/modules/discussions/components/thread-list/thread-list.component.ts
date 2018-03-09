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
    providers: [SortByDatePipe]
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
    public result: any;
    public sub: any;
    public id: number;
    public batchId:any;
    public loading: boolean;
    
    public msg: any;
    public param: any;

    public query: string;
    public filteredList: any;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute,
        private discussionService: DiscussionsApiservice, @Inject(DOCUMENT) document: any,toasterService: ToasterService) {     
        this.toasterService = toasterService;
    }
    public displayThreads() {
        console.log("Called");
        this.discussionService.getThreads(this.batchId).subscribe(data => {
            console.log('data from getThreads', data);
            this.threads = data;
            this.result = this.threads.result.threads;
            console.log('result: ', this.result);
            if (this.result === undefined) {
                this.toasterService.error("Error in displaying threads");

            }
            this.loading = false;
            // this.id = this.result[0].tags[0];
            // console.log(this.id, this.result[0].tags[0]);
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
        this.router.navigate(['/create-thread',  this.batchId = '0124543621061672965']);
    }
    gotoThread(threadId: number) {
        this.router.navigate(['/thread-details', threadId]);
        console.log('inside gotoThread()', threadId);
        this.discussionService.changeMessage(threadId);
    }

    //On Archive of Thread function
    public archivedState : boolean;
    public index : any;
  public onArchive(id, state) {
    console.log('inside onArchive()', id, state);
    this.discussionService.archiveAction(id).subscribe(data => {
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

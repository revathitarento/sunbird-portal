
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from './../../interfaces/discussions.interface';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var jquery: any;
declare var $: any;
@Component({
    selector: 'app-create-thread',
    templateUrl: './create-thread.component.html',
    styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
    public successMessage: boolean;
    public sub: any;
    public id: number;
    public loading: boolean;
    public isLoading: boolean;
    public result: any;
    public errorMessage: boolean;
    public contextId: number|string;
    public discussionsModel = new DiscussionsObject('', '', '');    
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) { 
        this.discussionsModel.contextType = 'batch';
        
    }
    ngOnInit() {
        this.loading = true;
        this.errorMessage = false;
        this.contextId = '0124543621061672965';
        this.sub = this.route.params.subscribe(params => {
            this.loading = false;
            this.id = params['id'];
            
        });
    }
    public changeWidget() {
        this.router.navigate(['/thread-list', this.id]);
    }
    showErrfield() {
        $('.ui.negative.message').show();
      }
    public onCreateThread() {
        this.isLoading = true;
        this.discussionService.postThread(this.contextId,this.discussionsModel).subscribe(data => {
            this.successMessage = false;
            this.result = data;
            this.isLoading = !this.isLoading;
            if (this.result.result.id != null || this.result.result.id !== undefined) {
            //    this.discussionsModel.threadTitle = '';
            //    this.discussionsModel.threadDesc = '';              
                this.successMessage = true;
                setTimeout(() => {
                    this.changeWidget();
                }, 3000);
            } 
        },
        err => {
            this.errorMessage = true;
            setTimeout(() => {
                this.changeWidget();
            }, 3000);
        }
    );
    }
}

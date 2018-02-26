import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
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
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) { }
    ngOnInit() {
        this.loading = true;
        this.errorMessage = false;
        this.sub = this.route.params.subscribe(params => {
            this.loading = false;
            this.id = params['id'];
        });
    }
    public changeWidget() {
        this.router.navigate(['/migration/thread-list', this.id]);
    }
    public onCreateThread() {
        this.isLoading = true;
        this.discussionService.postThread(this.discussionsModel).subscribe(data => {
            this.successMessage = false;
            this.result = data;
            this.isLoading = !this.isLoading;
            if (this.result.result.id != null || this.result.result.id !== undefined) {
                this.discussionsModel.threadTitle = '';
                this.discussionsModel.threadDesc = '';
                this.successMessage = true;
                setTimeout(() => {
                    this.changeWidget();
                }, 1000);
            } else {
                this.errorMessage = true;
            }
        });
    }
}

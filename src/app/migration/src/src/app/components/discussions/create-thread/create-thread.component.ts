import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../services/discussions/discussions.service';
@Component({
    selector: 'app-create-thread',
    templateUrl: './create-thread.component.html',
    styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit, OnDestroy {
    public successMessage: boolean;
    public sub: any;
    public id: any;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) { }
    public ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            console.log('param', params);
            this.id = params['id'];
        });
    }
    public changeWidget() {
        console.log('inside changeWidget()');
        this.router.navigate(['migration/thread-list/', this.id]);
    }
    public ngOnDestroy() {
        this.sub.unsubscribe();
    }
    public onCreateThread() {
        console.log('inside onCreateThread()', this.discussionsModel);
        this.successMessage = true;
        this.discussionService.postThread(this.discussionsModel).subscribe(data => {
            console.log('data from creation', data);
            this.changeWidget();
        });
    }
}

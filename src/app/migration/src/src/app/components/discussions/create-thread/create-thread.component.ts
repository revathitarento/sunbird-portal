import { Component, OnInit } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router } from '@angular/router';
import { DiscussionsApiservice } from '../../../services/discussions/discussions.service';
@Component({
    selector: 'app-create-thread',
    templateUrl: './create-thread.component.html',
    styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
    public successMessage: boolean;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private discussionService: DiscussionsApiservice) { }
    ngOnInit() {
    }
    changeWidget() {
        console.log('inside changeWidget()');
        this.router.navigate(['migration/thread-list']);
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

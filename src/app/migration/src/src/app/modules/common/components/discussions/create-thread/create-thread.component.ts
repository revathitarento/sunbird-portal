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
export class CreateThreadComponent implements OnInit, OnDestroy {
    public successMessage: boolean;
    public sub: any;
    public id: any;
    public isLoading: boolean;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) { }
    public ngOnInit() {
        $(function () {
            $('div#toolbarContainer').froalaEditor({
              pluginsEnabled: ['wordPaste'],
              heightMin: 300,
              heightMax: 300,
              toolbarButtons: ['bold', 'italic', 'underline', 'undo', 'redo'],
              toolbarButtonsSM: ['bold', 'italic', 'underline', 'undo', 'redo'],
              toolbarButtonsMD: ['bold', 'italic', 'underline', 'undo', 'redo'],
              toolbarButtonsXS: ['bold', 'italic', 'underline', 'undo', 'redo'],
            });
          });
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
        // this.sub.unsubscribe();
    }
    public onCreateThread() {
        this.isLoading = true;
        this.successMessage = true;
        this.discussionService.postThread(this.discussionsModel).subscribe(data => {
            console.log('data from creation', data);
            this.isLoading = !this.isLoading;
            this.changeWidget();
        });
    }
}

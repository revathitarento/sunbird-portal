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
    public result: any;
    public errorMessage: boolean;
    public discussionsModel = new DiscussionsObject('', '', '');
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) { }
    ngOnInit() {
        this.loading = true;
        this.errorMessage =  false;
        // $(function () {
        //     $('div#toolbarContainer').froalaEditor({
        //       pluginsEnabled: ['wordPaste'],
        //       heightMin: 300,
        //       heightMax: 300,
        //       toolbarButtons: ['bold', 'italic', 'underline', 'undo', 'redo'],
        //       toolbarButtonsSM: ['bold', 'italic', 'underline', 'undo', 'redo'],
        //       toolbarButtonsMD: ['bold', 'italic', 'underline', 'undo', 'redo'],
        //       toolbarButtonsXS: ['bold', 'italic', 'underline', 'undo', 'redo'],
        //     });
        //   });
        this.sub = this.route.params.subscribe(params => {
            this.loading = false;           
            this.id = params['id'];
        });
    }
    changeWidget() {
        console.log('inside changeWidget()');
        this.router.navigate(['/migration/thread-list',this.id]);
    }
    public onCreateThread() {
        console.log('inside onCreateThread()', this.discussionsModel);        
        this.loading = true;
        this.discussionService.postThread(this.discussionsModel).subscribe(data => {
            this.successMessage = false;
            this.result = data;
            this.loading = false;
            console.log('data from creation', data);   
            console.log("this.result.result.id  ", this.result.result.id  );        
            if(this.result.result.id != null || this.result.result.id != undefined){   
                console.log("result id not null");    
                this.successMessage = true; 
                setTimeout(()=> {
                    console.log("inside settimeout");                    
                    this.changeWidget() ;
                  }, 3000);          
                
             }           
             else{
                this.errorMessage = true;
             } 
        });
    }
    
}

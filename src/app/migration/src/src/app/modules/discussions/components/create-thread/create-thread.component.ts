
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from './../../interfaces/discussions.interface';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
// import { threadConfig } from './../../interfaces/threadConfig.interface';

declare var jquery: any;
declare var $: any;
@Component({
    selector: 'app-create-thread',
    templateUrl: './create-thread.component.html',
    styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
            /**
   * Reference of resourceService
   */
  public resourceService: ResourceService;
  /**
	 * Contains threadConfig details in
     * CreateThread service
	 */
//   threadConfig: threadConfig;
  /**
   * Reference of toaster service
   */
  private toasterService: ToasterService;
    public successMessage: boolean;
    public sub: any;
    public id: number;
    public loading: boolean;
    public isLoading: boolean;
    public result: any;
    public errorMessage: boolean;
    public contextId: number|string;

    public discussionsModel = new DiscussionsObject('', '', '','');    
    constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice, toasterService: ToasterService) { 
        this.discussionsModel.contextType = 'batch';
        this.toasterService = toasterService;
    }
    ngOnInit() {
        this.loading = true;
       // this.errorMessage = false;
        this.contextId = '0124543621061672965';
        this.sub = this.route.params.subscribe(params => {
            this.loading = false;
            this.id = params['id'];
            
        });

        this.discussionsModel.threadConfig =  {
            upVote: false,
            downVote: false,
            flag: false,
            acceptAnswer: false
        };
    }

    public changeAction: boolean;
    onFilterChange(type,value) {
        this.changeAction = value;
       
        if(type == this.discussionsModel.threadConfig.upVote){          
            this.discussionsModel.threadConfig.upVote = value;
        }
       else if(type == this.discussionsModel.threadConfig.downVote){
          this.discussionsModel.threadConfig.downVote = value;
        }
        else if(type == this.discussionsModel.threadConfig.flag){
            this.discussionsModel.threadConfig.flag = value;
          }
          else if(type == this.discussionsModel.threadConfig.acceptAnswer){
            this.discussionsModel.threadConfig.acceptAnswer = value;
          }
          console.log("final thread", this.discussionsModel.threadConfig);
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
               // this.successMessage = true;
                // setTimeout(() => {
                //     this.changeWidget();
                // }, 3000);
            this.toasterService.success("Success in creating questions");
                
            } 
        },
        err => {
            this.toasterService.error("Error in creating the question");
    
    
           // this.errorMessage = true;
            // setTimeout(() => {
            //     this.changeWidget();
            // }, 3000);
        }
    );
    }
}

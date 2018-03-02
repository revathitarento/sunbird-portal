import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Inject,ViewChild } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'lodash';
declare var jquery: any;
declare var $: any;
import { SortByDatePipe } from '../sort-by-date.pipe';
import {PlatformLocation } from '@angular/common';
import {SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize} from "ng2-semantic-ui";

export interface IContext {
  data:boolean;
}

@Component({
  selector: 'app-thread-details',
  templateUrl: './thread-details.component.html',
  styleUrls: ['./thread-details.component.css'],
  providers: [SortByDatePipe]
})
export class ThreadDetailsComponent implements OnInit, AfterViewInit {
  public el: HTMLInputElement;
  public successMessage: boolean;
  public message: any;
  public threadDetails: any;
  public replyActions: any;
  public sub: any;
  public id: any;
  public reply: any;
  public replyData: any;
  public replyResult: any;
  public isLoading: boolean;
  public loading: boolean;
  public markResult: any;
  public markResValue: any;
  public markRepId: number;
  public lockedId: number;
  public lockedState: boolean;
  public href: string;
  public deletedId: number;
  public deletedState: boolean;
  public isCopied: boolean;
  public archivedId: number;
  public archivedState: boolean;
  public discussionsModel = new DiscussionsObject('', '', '');
  public notifyActions: boolean;
  public replies: any;
  public replyId: number;
  public btnloader: boolean;
  public param: any;
  public actionResult: any;
  public repId: any;
  public actId: number;
  public repArray: any;
  public actionType: any;
  public currentLocation: any;
  public replyHash: any;
    public shareLink : any;


@ViewChild('modalTemplate')
public modalTemplate:ModalTemplate<null, string, string>

public open(dynamicContent:boolean = true) {
  const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

  config.closeResult = "closed!";
  config.context = { data: dynamicContent };

  this.modalService
      .open(config)
      .onApprove(result => { /* approve callback */ })
      .onDeny(result => { /* deny callback */});
}
  // {{currentLocation + "#" + reply.id}}
  ngOnInit() {
    this.loading = true;
    this.notifyActions = false;
    this.loading = true;
    this.param = '-createdDate';
    this.modalFlag = false;
    this.sub = this.route.params.subscribe(params => {
      console.log('param', params);
      this.id = params['threadId'];
      console.log('id.', params['threadId'], this.id);
    });
    this.discussionService.getThreadbyId(this.id).subscribe(data => {
      this.loading = false;
      this.threadDetails = data['result'];
      console.log('result', this.threadDetails);
      this.loadReplyActions(this.threadDetails.thread.replies);
      this.replies = this.threadDetails.thread.replies;
      console.log('result this.replies', this.replies);
      this.loadReplyActions(this.threadDetails.thread.replies);
    });
    this.param = 'createdDate';
  }

  ngAfterViewInit(){
    this.highlightReply(); 
    this.postDwellTime();
  }

  private highlightReply() {   
    var replyPositionId = this.replyHash.hash;
    if(replyPositionId.val !== undefined){
    var position = $(replyPositionId).offset().top;
    console.log("position: ", position);
    $("body, html").animate({
      scrollTop: position
    }, 1000);
    $(replyPositionId).addClass("highlighted");
    setTimeout(() => {
      $(replyPositionId).removeClass("highlighted");
    }, 2000);
  }
  }

    private postDwellTime(){      
      let horizontalCenter = Math.floor(window.innerWidth/2);
      let verticalCener = Math.floor(window.innerHeight/2);
      console.log("verticalCener", verticalCener);
    }
  
  showErrfield() {
    $('.ui.negative.message').show();
  }
public size: string;
  constructor(private router: Router, private elementRef: ElementRef,
    private route: ActivatedRoute, private discussionService: DiscussionsApiservice,
    @Inject(DOCUMENT) document: any, platformLocation: PlatformLocation, public modalService:SuiModalService) {
    this.isCopied = false;
    this.href = document.location.href;
    console.log('href', this.href);
    this.discussionService.currentMessage.subscribe(message => this.message = message);
    console.log('getting from service', this.message);
    this.el = this.elementRef.nativeElement.innerHTML;
    this.size = ModalSize.Small;
    this.replyHash = (platformLocation as any).location;
    this.currentLocation = ((platformLocation as any).location.href);
    console.log((platformLocation as any).location.origin);
  }
  public loadReplyActions(replies) {
    const replyActions = {};
    _.forEach(replies, function (reply) {
      replyActions[reply.id] = {};
      const actions = _.filter(reply.actions_summary, function (action) {
        if (action.acted === true && action.can_undo === true) {
          replyActions[reply.id][action.id] = 'acted';
        } else {
          replyActions[reply.id][action.id] = 'can_act';
        }
      });
    });
    this.replyActions = replyActions;
  }
  public showAction(id, actionTypeId) {
    const action = this.replyActions[id][actionTypeId];
    return action;
  }
  public upVoteAction(id, undo, status) {
    console.log('inside uvoteAction() id', id);
    console.log('inside uvoteAction() undo', undo);
    console.log('inside uvoteAction() status', status);
    this.discussionService.upvoteAction(id, undo).subscribe(data => {
      console.log('data from voting', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread' ) {
          if(undo === true){
          console.log("thread action", this.threadDetails)
          this.threadDetails['thread']['actions'].vote = 0;
        } else {
          this.threadDetails['thread']['actions'].vote = 1;
        }
      }

        if (status === 'reply') {          
          this.repId = id;         
          console.log("reply replies",this.threadDetails['thread']['replies']);
         console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
         let index  = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
         if( undo === true){
              this.threadDetails['thread']['replies'][index]['actions'].vote = 0;              
            }
            else {
              this.threadDetails['thread']['replies'][index]['actions'].vote = 1;              
            }        
        } 
      }
    });
  }

  //Down Vote thread and replies
  public downVoteAction(id, undo, status) { 
    console.log('inside dvoteAction()', id);
    this.discussionService.downvoteAction(id, undo).subscribe(data => {
      console.log('data from downvoting', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread' ) {
          if(undo === true){
          console.log("thread action", this.threadDetails)
          this.threadDetails['thread']['actions'].downVote = 0;
        } else {
          this.threadDetails['thread']['actions'].downVote = 1;
        }
      }

        if (status === 'reply') {          
          this.repId = id;         
          console.log("reply replies",this.threadDetails['thread']['replies']);
         console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
         let index  = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
         if( undo === true){
              this.threadDetails['thread']['replies'][index]['actions'].downVote = 0;              
            }
            else {
              this.threadDetails['thread']['replies'][index]['actions'].downVote = 1;              
            }        
        } 
      }
    });
  }

  //Flag Action for Thread and Replies
  public flagAction(id, undo, status){
    console.log('inside flagAction() id', id);
    console.log('inside glagAction() undo', undo);
    console.log('inside flagAction() status', status);
    this.discussionService.flagAction(id,undo).subscribe(data => {
      console.log("flag result", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread' ) {
          if(undo === true){
          console.log("thread action", this.threadDetails)
          this.threadDetails['thread']['actions'].flag = 0;
        } else {
          this.threadDetails['thread']['actions'].flag = 1;
        }
      }

      if (status === 'reply'){
        this.repId = id;         
        console.log("reply replies",this.threadDetails['thread']['replies']);
       console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
       let index  = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
       if( undo === true){
            this.threadDetails['thread']['replies'][index]['actions'].flag = 0;              
          }
          else {
            this.threadDetails['thread']['replies'][index]['actions'].flag = 1;              
          } 
      }
    }
    }); 
  }

  // public actions(id, actionTypeId) {
  //   this.showAction(id, actionTypeId);
  //   this.discussionService.actions(id, actionTypeId).subscribe(data => {
  //     this.actionResult = data;
  //     this.replyActions[id][actionTypeId] = 'acted';
  //     // this.notifyActions = true;
  //     this.repArray = this.replyActions[id];
  //     const repId = this.actionResult.result.id;
  //     console.log('this.repArray ', this.repArray, this.repArray[actionTypeId]);
  //     console.log('actionTypeId from root ', actionTypeId, id);

  //     this.showNotify(repId, actionTypeId, this.replyActions[id][actionTypeId]);
  //   });
  // }

  // public undoActions(id, actionTypeId) {
  //   console.log('inside undoActions()', id, actionTypeId);
  //   this.discussionService.undoActions(id, actionTypeId).subscribe(data => {

  //     this.replyActions[id][actionTypeId] = 'can_act';
  //     console.log('../', this.replyActions);
  //     // this.notifyActions = true;
  //     this.showNotify(id, actionTypeId, this.replyActions[id][actionTypeId]);
  //   });
  // }

  public showNotify(id, actionTypeId, actionType) {
    this.repId = id;
    this.actId = actionTypeId;
    this.actionType = actionType;
    console.log('shownotify called,repId, actId, actionType: ', this.repId, this.actId, this.actionType);
    this.notifyActions = true;
    setTimeout(() => {
      this.notifyActions = false;
      console.log('inside settimeout');
    }, 3000);
  }

  changeWidget() {
    console.log('inside changeWidget()');
    this.router.navigate(['migration/thread-list']);
  }
  //  ngOnDestroy() {
  //    this.sub.unsubscribe();
  //  }
  public submitReply() {
    this.isLoading = true;
    this.reply = {
      'contextId': 'do_212390847580487680138',
      'description': this.discussionsModel.replyAnswer
    };
    this.btnloader = true;
    this.discussionService.postReply(this.id, this.reply).subscribe(data => {
      this.btnloader = false;
      this.replyData = data;
      console.log('thread details reponse: ', this.replyData);
      this.replyResult = this.replyData.result.id;
      this.isLoading = !this.isLoading;
      this.loadReplies(this.replyResult);
      if (this.replyResult !== undefined) {
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
          console.log('inside settimeout');
        }, 2000);
      }
      console.log('data from post reply is id', this.replyResult);
    });
  }

  public markAsCorrect(replyId, state) {
  
   console.log("mark state", state);
    this.discussionService.markAsCorrect(replyId, !state).subscribe(data => {
      //this.markRepId = replyId;
      // this.markResult = data;
      // this.markResValue = this.markResult.result.option;
      console.log('Result of markAsCorrect: ', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId }));
        let index  = _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId });
        if(state === true){         
          console.log("thread action inside true state", this.threadDetails)
          this.threadDetails['thread']['replies'][index]['actions'].acceptAnswer = 1;
          this.threadDetails['thread']['replies'][index].acceptedAnswer = true;
        } 
        else {
          console.log("thread action inside flase state", this.threadDetails);
          this.threadDetails['thread']['replies'][index]['actions'].acceptAnswer = 0;
          this.threadDetails['thread']['replies'][index].acceptedAnswer = false;
        }
      }
    });
  }


  public loadReplies(threadId) {
    this.discussionService.getThreadbyId(this.id).subscribe(data => {
      this.replyData = data;
      this.replyResult = this.replyData.result.thread.replies;
      console.log('load replies data, replyResult replies', data, this.replyResult);
      this.threadDetails = this.replyData.result;
      this.loadReplyActions(this.replyResult);
      this.discussionsModel.replyAnswer = '';
      $('.ui.negative.message').hide();
    });
  }
  public onEditReply(replyId) {
    for (let i = 0; i < this.threadDetails.thread.replies.length; i++) {
      if (replyId === this.threadDetails.thread.replies[i].id) {
        this.el = this.threadDetails.thread.replies[i].cooked;
        this.discussionsModel.replyAnswer = this.threadDetails.thread.replies[i].cooked;
      }
    }
    console.log('inside ', this.threadDetails, this.discussionsModel.replyAnswer);
  }
  public onLock(id, isLocked) {
    this.lockedState = false;
    console.log('inside onLock', id, isLocked);
    this.discussionService.lockAction(id, isLocked).subscribe(data => {
      this.lockedId = data['result'].id
      this.lockedState = data['result'].option;
      console.log('lock response', data, this.lockedId, this.lockedState);
    });
  }
  public linkShare() {
    alert('copied' + this.href);
  }
  public spamAction(id, isSpam) {
    console.log("isSpam: ", isSpam);
    if(isSpam === undefined){
      isSpam = true; 
    };
    console.log('inside onDelete()', id, isSpam);
    this.discussionService.spamAction(id, isSpam).subscribe(data => {
      this.deletedId = data['result'].id;
      this.deletedState = data['result'].option;      
      isSpam = this.deletedState;
      console.log(" isSpam",  isSpam);
      console.log(" deletedState",  this.deletedState);
    });   
    isSpam = this.deletedState;
  }
  public onArchive(id, isArchived) {
    console.log('inside onArchive()', id, isArchived);
    this.discussionService.archiveAction(id, isArchived).subscribe(data => {
      this.archivedId = data['result'].id;
      this.archivedState = data['result'].option;
    });
  }

  ascSortClick() {
    this.param = 'createdDate';
  }
  descSortClick() {
    this.param = '-createdDate';
  }

  //replylinkShare()
  replylinkShare(params, replyId ) {
    window.open(this.currentLocation +"#"+replyId, "_blank");
    console.log("reply id:, currentLocation: ", replyId, this.currentLocation);   
   
  } 
  public modalFlag: boolean;
  public popupId: number;
  //isFoo:boolean ;
  //this.modalFlag = false;
  showPopup( isFoo, popupReplyId){
    this.modalFlag = true;
   //isFoo = false;
    this.popupId = popupReplyId; 
    this.shareLink = this.currentLocation +"#"+this.popupId;
    console.log("isFoo",isFoo);
  }
}

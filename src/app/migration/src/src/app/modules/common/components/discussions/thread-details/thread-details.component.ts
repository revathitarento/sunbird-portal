import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'lodash';
declare var jquery: any;
declare var $: any;
import { SortByDatePipe } from '../sort-by-date.pipe';
import {PlatformLocation } from '@angular/common';



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
  ngOnInit() {
    this.loading = true;
    this.notifyActions = false;
    // this.href = this.router.url;
    // console.log('href', this.href);
    this.param = '-created_at';
    $(function () {
      $('div#custom-toolbar').froalaEditor({
        pluginsEnabled: ['wordPaste'],
        heightMin: 200,
        heightMax: 200
        // toolbarButtons: ['bold', 'italic', 'underline', 'undo', 'redo'],
        // toolbarButtonsSM: ['bold', 'italic', 'underline', 'undo', 'redo'],
        // toolbarButtonsMD: ['bold', 'italic', 'underline', 'undo', 'redo'],
        // toolbarButtonsXS: ['bold', 'italic', 'underline', 'undo', 'redo'],
      });
    });
    this.loading = true;
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
    this.param = '-created_at';
  }

  ngAfterViewInit(){
    this.highlightReply(); 
    this.postDwellTime();
  }

  private highlightReply() {   
    var replyPositionId = this.replyHash.hash;
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

    private postDwellTime(){      
      let horizontalCenter = Math.floor(window.innerWidth/2);
      let verticalCener = Math.floor(window.innerHeight/2);
      console.log("verticalCener", verticalCener);
    }
  
  showErrfield() {
    $('.ui.negative.message').show();
  }

  constructor(private router: Router, private elementRef: ElementRef,
    private route: ActivatedRoute, private discussionService: DiscussionsApiservice,
    @Inject(DOCUMENT) document: any, platformLocation: PlatformLocation) {
    this.isCopied = false;
    this.href = document.location.href;
    console.log('href', this.href);
    this.discussionService.currentMessage.subscribe(message => this.message = message);
    console.log('getting from service', this.message);
    this.el = this.elementRef.nativeElement.innerHTML;
    // this.discussionService.getThreadbyId(this.id).subscribe(data => {
    //   this.threadDetails = data['result'];
    //   this.loadReplyActions(this.threadDetails.thread.replies);
    // });
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

  public actions(id, actionTypeId) {
    this.showAction(id, actionTypeId);
    this.discussionService.actions(id, actionTypeId).subscribe(data => {
      this.actionResult = data;
      this.replyActions[id][actionTypeId] = 'acted';
      // this.notifyActions = true;
      this.repArray = this.replyActions[id];
      const repId = this.actionResult.result.id;
      console.log('this.repArray ', this.repArray, this.repArray[actionTypeId]);
      console.log('actionTypeId from root ', actionTypeId, id);

      this.showNotify(repId, actionTypeId, this.replyActions[id][actionTypeId]);
    });

  }

  public undoActions(id, actionTypeId) {
    console.log('inside undoActions()', id, actionTypeId);
    this.discussionService.undoActions(id, actionTypeId).subscribe(data => {

      this.replyActions[id][actionTypeId] = 'can_act';
      console.log('../', this.replyActions);
      // this.notifyActions = true;
      this.showNotify(id, actionTypeId, this.replyActions[id][actionTypeId]);
    });
  }

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
      if (this.replyResult !== undefined) {
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
          console.log('inside settimeout');
        }, 2000);
      }
      console.log('data from post reply is id', this.replyResult);
      this.loadReplies(this.replyResult);
    });
  }

  public markAsCorrect(replyId, state) {
    this.markResValue = false;
    this.discussionService.markAsCorrects(replyId, state).subscribe(data => {
      this.markRepId = replyId;
      this.markResult = data;
      this.markResValue = this.markResult.result.option;
      console.log('Result of markAsCorrect: ', this.markResValue);
      if (this.markResult.result === true) {

      }
      //  var replyIndex =  _.indexOf(_.pluck(result.replies, 'id'), replyId);

      //  console.log("replyIndex ",replyIndex)
      //  this.thread.replies[replyIndex].accepted_answer = true;

      // }, function(err) {
      //   console.log('error while marking correct answer', err)
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
        // const id: any = '';
        // this.el = this.threadDetails.thread.replies[i].cooked;
        // console.log('iddd', this.el.outerHTML, this.el.outerText);
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
    alert('copied');
    this.isCopied = true;
    console.log('link', this.isCopied);
  }
  public onDelete(id, isDeleted) {
    console.log('inside onDelete()', id, isDeleted);
    this.discussionService.deleteAction(id, isDeleted).subscribe(data => {
      this.deletedId = data['result'].id;
      this.deletedState = data['result'].option;
    });
  }
  public onArchive(id, isArchived) {
    console.log('inside onArchive()', id, isArchived);
    this.discussionService.archiveAction(id, isArchived).subscribe(data => {
      this.archivedId = data['result'].id;
      this.archivedState = data['result'].option;
    });
  }

  ascSortClick() {
    this.param = 'created_at';
  }
  descSortClick() {
    this.param = '-created_at';
  }

  //replylinkShare()
  replylinkShare(params, replyId ) {
    window.open(this.currentLocation +"#"+replyId, "_blank");
    console.log("reply id:, currentLocation: ", replyId, this.currentLocation);   
   
  } 
}

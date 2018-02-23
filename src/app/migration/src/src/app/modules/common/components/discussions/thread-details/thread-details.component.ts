import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../../../services/discussions/discussions.service';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'lodash';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-thread-details',
  templateUrl: './thread-details.component.html',
  styleUrls: ['./thread-details.component.css']
})
export class ThreadDetailsComponent implements OnInit {
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
  ngOnInit() {
    // this.href = this.router.url;
    // console.log('href', this.href);
    // $(function () {
    //   $('div#custom-toolbar').froalaEditor({
    //     toolbarContainer: '#toolbarContainer',
    //     pluginsEnabled: ['wordPaste'],
    //     heightMin: 300,
    //     heightMax: 300,
    //     toolbarButtons: ['bold', 'italic', 'underline', 'undo', 'redo'],
    //     toolbarButtonsSM: ['bold', 'italic', 'underline', 'undo', 'redo'],
    //     toolbarButtonsMD: ['bold', 'italic', 'underline', 'undo', 'redo'],
    //     toolbarButtonsXS: ['bold', 'italic', 'underline', 'undo', 'redo'],
    //   });
    // });
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
    });
  }
  constructor(private router: Router, private elementRef: ElementRef,
    private route: ActivatedRoute, private discussionService: DiscussionsApiservice,
    @Inject(DOCUMENT) document: any) {
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
      this.replyActions[id][actionTypeId] = 'acted';
    });
  }
  public undoActions(id, actionTypeId) {
    this.discussionService.undoActions(id, actionTypeId).subscribe(data => {
      this.replyActions[id][actionTypeId] = 'can_act';
    });
  }
  public changeWidget() {
    this.router.navigate(['migration/thread-list/', this.id]);
  }
  public submitReply() {
    this.isLoading = true;
    this.reply = {
      'contextId': 'do_212390847580487680138',
      'description': this.discussionsModel.replyAnswer
    };
    this.discussionService.postReply(this.id, this.reply).subscribe(data => {
      if (data !== undefined) {
        this.successMessage = true;
        this.isLoading = !this.isLoading;
      }
      this.replyData = data;
      this.replyResult = this.replyData.result.id;
      this.loadReplies(this.replyResult);
    });
  }

  public loadReplies(threadId) {
    this.discussionService.getThreadbyId(this.id).subscribe(data => {
      this.replyData = data;
      this.replyResult = this.replyData.result.thread.replies;
      this.threadDetails = this.replyData.result;
      this.loadReplyActions(this.replyResult);
      this.discussionsModel.replyAnswer = '';
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
      this.lockedId = data['result'].id;
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
}

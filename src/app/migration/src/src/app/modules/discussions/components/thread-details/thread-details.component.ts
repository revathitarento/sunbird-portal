import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsObject } from './../../interfaces/discussions.interface';
import { replyObject } from './../../interfaces/reply.interface';
import { DiscussionsApiservice } from './../../services/discussions.service';
import { DOCUMENT } from '@angular/platform-browser';
import { SortByDatePipe } from './../../pipes/sort-thread-reply/sort-by-date.pipe';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
declare var jquery: any;
declare var $: any;
import { PlatformLocation } from '@angular/common';
import { ShareButtons } from '@ngx-share/core';
import { SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize } from "ng2-semantic-ui";

export interface IContext {
  data: boolean;
}

@Component({
  selector: 'app-thread-details',
  templateUrl: './thread-details.component.html',
  styleUrls: ['./thread-details.component.css'],
  providers: [SortByDatePipe]
})
export class ThreadDetailsComponent implements OnInit, AfterViewInit {
  /**
* Reference of resourceService
*/
  public resourceService: ResourceService;

  /**
   * Reference of toaster service
   */
  private toasterService: ToasterService;
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

  public archivedState: boolean;
  public discussionsModel = new DiscussionsObject('', '', '');
  public replyObject = new replyObject('', '', '');
  public notifyActions: boolean;
  public replies: any;
  public replyId: number;
  public btnloader: boolean;
  public param: any;
  public repId: any;
  public currentLocation: any;
  public replyHash: any;
  public shareLink: any;
  public location: any
  public threadUrl: any;
  public errorData: any;
  public errMsg: string;
  public modalFlag: boolean;
  public popupId: number;

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<null, string, string>

  public open(dynamicContent: boolean = true) {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

    config.closeResult = "closed!";
    config.context = { data: dynamicContent };

    this.modalService
      .open(config)
      .onApprove(result => { /* approve callback */ })
      .onDeny(result => { /* deny callback */ });
  }
  public size: string;
  constructor(private router: Router, private elementRef: ElementRef,
    private route: ActivatedRoute, private discussionService: DiscussionsApiservice, toasterService: ToasterService,
    @Inject(DOCUMENT) document: any, platformLocation: PlatformLocation, public modalService: SuiModalService) {
    this.isCopied = false;
    this.href = document.location.href;
    this.toasterService = toasterService;

    this.discussionService.currentMessage.subscribe(message => this.message = message);
    console.log('getting from service', this.message);
    this.el = this.elementRef.nativeElement.innerHTML;
    this.size = ModalSize.Small;
    this.replyHash = (platformLocation as any).location;
    this.currentLocation = ((platformLocation as any).location.href);

    this.location = ((platformLocation as any).location.origin);
    this.threadUrl = '/migration/thread-details';
    console.log("location.origin: ", (platformLocation as any).location.origin);
  }

  ngOnInit() {
    this.loading = true;
    this.notifyActions = false;
    this.loading = true;
    this.param = '-createdDate';
    this.modalFlag = false;

    this.sub = this.route.params.subscribe(params => {
      console.log('param', params);
      this.id = params['id'];
      console.log('id.', this.id);
    });
    this.discussionService.getThreadbyId(this.id).subscribe(
      (apiResponse: ServerResponse) => {
        this.loading = false;
        this.threadDetails = apiResponse.result;
        this.replies = this.threadDetails.thread.replies;
        console.log('result this.replies', this.replies);
        this.highlightReply();
        console.log("called on init");

      },
      err => {
        this.toasterService.error("Error in displaying Thread details");
        this.loading = false;
      });
    this.param = 'createdDate';


  }

  ngAfterViewInit() {
    this.postDwellTime();
    this.threadDetails.thread.newTitle = this.threadDetails.thread.title;
    this.threadDetails.thread.newBody = this.threadDetails.thread.body;
    this.highlightReply();
  }

  private highlightReply() {
    console.log("called");
    //alert();

    var replyPositionId = this.replyHash.hash;
    replyPositionId.split('#').join('');
    console.log("reply hash", replyPositionId);
    if (replyPositionId !== undefined) {
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
    window.location.href = this.currentLocation;
  }

  private postDwellTime() {
    let horizontalCenter = Math.floor(window.innerWidth / 2);
    let verticalCener = Math.floor(window.innerHeight / 2);
    console.log("verticalCener", verticalCener);
  }

  showErrfield() {
    $('.ui.negative.message').show();
  }

  public upVoteAction(id, undo, status) {
    console.log('inside uvoteAction() id', id);
    console.log('inside uvoteAction() undo', undo);
    console.log('inside uvoteAction() status', status);
    this.discussionService.upvoteAction(id, undo).subscribe(data => {
      console.log('data from voting', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread') {
          if (undo === true) {
            console.log("thread action", this.threadDetails)
            this.threadDetails['thread']['actions'].vote = 0;
            this.toasterService.success("Undone the upvote of thread");
          } else {
            this.threadDetails['thread']['actions'].vote = 1;
            this.toasterService.success("You up voted the thread");
          }
        }

        if (status === 'reply') {
          this.repId = id;
          console.log("reply replies", this.threadDetails['thread']['replies']);
          console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
          let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
          if (undo === true) {
            this.threadDetails['thread']['replies'][index]['actions'].vote = 0;
            this.toasterService.success("Undone the upvote of reply");
          }
          else {
            this.threadDetails['thread']['replies'][index]['actions'].vote = 1;
            this.toasterService.success("You up voted the reply");
          }
        }
      }
      this.showNotify(id);
    },
      error => {
        this.errorData = error;
        console.log("upvote error", error);
        this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(this.errMsg);
      });
  }

  //Down Vote thread and replies
  public downVoteAction(id, undo, status) {
    console.log('inside dvoteAction()', id);
    this.discussionService.downvoteAction(id, undo).subscribe(data => {
      console.log('data from downvoting', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread') {
          if (undo === true) {
            console.log("thread action", this.threadDetails)
            this.threadDetails['thread']['actions'].downVote = 0;
            this.toasterService.success("Undone the down vote of thread");
          } else {
            this.threadDetails['thread']['actions'].downVote = 1;
            this.toasterService.success("You down voted the thread");
          }
        }

        if (status === 'reply') {
          this.repId = id;
          console.log("reply replies", this.threadDetails['thread']['replies']);
          console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
          let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
          if (undo === true) {
            this.threadDetails['thread']['replies'][index]['actions'].downVote = 0;
            this.toasterService.success("Undone the down vote of reply");
          }
          else {
            this.threadDetails['thread']['replies'][index]['actions'].downVote = 1;
            this.toasterService.success("You down voted the reply");
          }
        }
      }
      this.showNotify(id);
    },
      error => {
        this.errorData = error;
        console.log("downvote error", error);
        // this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(error);
      });
  }

  //Flag Action for Thread and Replies
  public flagAction(id, undo, status) {
    console.log('inside flagAction() id', id);
    console.log('inside glagAction() undo', undo);
    console.log('inside flagAction() status', status);
    this.discussionService.flagAction(id, undo).subscribe(data => {
      console.log("flag result", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (status === 'thread') {
          if (undo === true) {
            console.log("thread action", this.threadDetails)
            this.threadDetails['thread']['actions'].flag = 0;
            this.toasterService.success("Successfully removed the flag");
          } else {
            this.threadDetails['thread']['actions'].flag = 1;
            this.toasterService.success("Successfully Flagged thread");
          }
        }

        if (status === 'reply') {
          this.repId = id;
          console.log("reply replies", this.threadDetails['thread']['replies']);
          console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': id }));
          let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
          if (undo === true) {
            this.threadDetails['thread']['replies'][index]['actions'].flag = 0;
            this.toasterService.success("Successfully removed the flag");
          }
          else {
            this.threadDetails['thread']['replies'][index]['actions'].flag = 1;
            this.toasterService.success("Successfully flagged reply");
          }
        }
      }
      // this.showNotify(id);

    },
      error => {
        this.toasterService.error("Error in Flagging thread");
        this.loading = false;
      }
    );
  }

  public showNotify(id) {
    this.repId = id;
    // this.actId = actionTypeId;
    // this.actionType = actionType;
    console.log('shownotify called,repId: ', this.id);
    this.notifyActions = true;
    setTimeout(() => {
      this.notifyActions = false;

    }, 2000);
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
      'contextId': '01245108888897126412',
      'description': this.discussionsModel.replyAnswer
    };
    this.btnloader = true;
    console.log("this.id in submitreply", this.id);
    this.discussionService.postReply(this.id, this.reply).subscribe(data => {
      console.log("return data from reply post", data);
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

        }, 2000);
      }
      console.log('data from post reply is id', this.replyResult);
    });
  }

  //Mark as correct answer for replies
  public markAsCorrect(replyId, state) {
    console.log("mark state", state);
    this.discussionService.markAsCorrect(replyId, !state).subscribe(data => {
      console.log('Result of markAsCorrect: ', data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        console.log("findindex", _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId }));
        let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId });
        if (state === true) {
          console.log("thread action inside true state", this.threadDetails)
          this.threadDetails['thread']['replies'][index]['actions'].acceptAnswer = 1;
          this.threadDetails['thread']['replies'][index].acceptedAnswer = true;
          this.toasterService.success("Marked as correct answer");
        }
        else {
          console.log("thread action inside flase state", this.threadDetails);
          this.threadDetails['thread']['replies'][index]['actions'].acceptAnswer = 0;
          this.threadDetails['thread']['replies'][index].acceptedAnswer = false;
          this.toasterService.success("Removed as correct answer");
        }
        this.showNotify(replyId);
      }
    });
  }

  //On Archive of Thread function
  public onArchive(id, state) {
    console.log('inside onArchive()', id, state);
    this.discussionService.archiveAction(id).subscribe(data => {
      console.log("Archive data", data['responseCode']);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (!this.threadDetails.thread.archived === true) {
          this.archivedState = true;
          console.log("status", data['result'].status);
          let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': id });
          this.threadDetails.thread.archived = true;
          this.toasterService.success("Thread archived successfully");
          this.router.navigate(['/thread-list/0124543621061672965']);
        }
        else {
          this.toasterService.error("Thread is already archived ");
        }
        //  this.showNotify(id);
      }
    },
      error => {
        this.errorData = error;
        console.log("error", error);
        this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(this.errMsg);
      });
  }


  public loadReplies(threadId) {
    this.discussionService.getThreadbyId(this.id).subscribe(data => {
      this.replyData = data;
      this.replyResult = this.replyData.result.thread.replies;
      console.log('load replies data, replyResult replies', data, this.replyResult);
      this.threadDetails = this.replyData.result;
      // this.loadReplyActions(this.replyResult);
      this.discussionsModel.replyAnswer = '';
      $('.ui.negative.message').hide();
    });
  }



  //On Edit Thread()
  public openThreadEdit: boolean = false;
  //this.openThreadEdit = false;

  public onEditThread(id, title, descId, body, openThreadEdit) {
    this.discussionsModel.threadTitle = this.threadDetails.thread.newTitle;
    this.discussionsModel.body = this.threadDetails.thread.newBody;
    this.discussionsModel.threadId = id;
    this.discussionsModel.descId = descId;
    //  this.discussionsModel.body = body;
    console.log("openThreadEdit", openThreadEdit);
    this.discussionService.editThread(this.discussionsModel).subscribe(data => {
      console.log("Edit thread ", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        this.threadDetails.thread.title = this.threadDetails.thread.newTitle;
        this.threadDetails.thread.body = this.threadDetails.thread.newBody;
        this.openThreadEdit = false;
        console.log("openThreadEdit after,", this.openThreadEdit);
      }
      else {
        console.log("Error in Editing thread");
      }
    },
      error => {
        // this.errorState = true;
        this.openThreadEdit = false;
        this.errorData = error;
        console.log("thread edit error", error);
        this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(this.errMsg);
      });
  }


  writeIconClick(openThreadEdit) {
    this.openThreadEdit = true;
    console.log("openthread write", this.openThreadEdit);
  }

  public openReplyEdit: boolean = false;
  public index: number;
  writeReplyIconClick(replyId, i) {

    this.index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId });
    if (replyId === this.threadDetails.thread.replies[this.index].id) {
      this.threadDetails.thread.replies[this.index].newBody = this.threadDetails.thread.replies[this.index].body;
      this.openReplyEdit = true;
      this.threadDetails.thread.replies[this.index]
    }
    else {
      //inline-edit-form.
      this.openReplyEdit = false;
      console.log("else of write rply icon");
    }
    //this.openReplyEdit = false;
  }
  //On Edit Reply()
  public onEditReply(threadId, replyId, replyBody, openReplyEdit) {
    this.replyObject.threadId = threadId;
    this.replyObject.replyId = replyId;
    this.replyObject.replyAnswer = replyBody;

    this.discussionService.editReply(this.replyObject).subscribe(data => {
      console.log("Edit Reply", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {

        let index = _.findIndex(this.threadDetails['thread']['replies'], { 'id': replyId });
        if (replyId === this.threadDetails.thread.replies[index].id) {
          this.threadDetails.thread.replies[index].body = this.threadDetails.thread.replies[index].newBody;
          this.replyObject.replyAnswer = this.threadDetails.thread.replies[index].newBody;
          this.toasterService.success("Editted the reply successfully");
        }
        this.openReplyEdit = false;
        console.log("reply  after,", this.threadDetails.thread.replies[index].newBody);
      }
    },
      error => {
        this.errorData = error;
        console.log("edit reply error", error);
        this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(this.errMsg);
        this.openReplyEdit = false;
      });
  }


  public onLock(id) {
    this.lockedState = false;
    console.log('inside onLock', id);
    this.discussionService.lockAction(id).subscribe(data => {
      console.log("locked data", data);
      if (data['responseCode'] === 'OK' && data['result'].status === 'done') {
        if (!this.threadDetails.thread.locked === true) {
          this.lockedId = data['result'].id
          this.lockedState = true;
          console.log('lock response', data, this.lockedId, this.lockedState);
          this.toasterService.success("Locked the thread successfully");
          this.router.navigate(['/thread-list/0124543621061672965']);
        }
        else {
          this.toasterService.error("Thread is already locked");
        }
      }
    },
      error => {
        this.errorData = error;
        this.errMsg = this.errorData.error.params.errmsg;
        this.toasterService.error(this.errMsg);
      });
  }

  public linkShare() {
    if (this.isCopied == false) {
      console.log('inside if');
      this.isCopied = true;
    }
  }

  public spamAction(id, isSpam) {
    console.log("isSpam: ", isSpam);
    if (isSpam === undefined) {
      isSpam = true;
    };
    console.log('inside onDelete()', id, isSpam);
    this.discussionService.spamAction(id, isSpam).subscribe(data => {
      this.deletedId = data['result'].id;
      this.deletedState = data['result'].option;
      isSpam = this.deletedState;
      console.log(" isSpam", isSpam);
      console.log(" deletedState", this.deletedState);
    });
    isSpam = this.deletedState;
  }



  ascSortClick() {
    this.param = 'createdDate';
  }
  descSortClick() {
    this.param = '-createdDate';
  }

  //replylinkShare()
  replylinkShare(params, replyId) {
    //window.open(this.location+this.threadUrl+"#"+replyId, "_blank");
    //this._platformLocation.onHashChange(fn);
    console.log("reply id:, currentLocation: ", replyId, this.currentLocation);
    console.log("location", this.location + this.threadUrl + "#" + replyId);

  }
  showPopup(popupReplyId) {
    this.isCopied = false;
    this.modalFlag = true;
    this.popupId = popupReplyId;
    this.shareLink = this.currentLocation + "#" + this.popupId;
  }
}

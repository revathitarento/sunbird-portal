import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionsObject } from '../interfaces/discussions.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionsApiservice } from '../../../services/discussions/discussions.service';
import * as _ from 'lodash';
@Component({
 selector: 'app-thread-details',
 templateUrl: './thread-details.component.html',
 styleUrls: ['./thread-details.component.css']
})
export class ThreadDetailsComponent implements OnInit, OnDestroy {
 public successMessage: boolean;
 public message: any;
 public threadDetails: any;
 public replyActions: any;
 public sub: any;
 public id: any;
 public reply: any;
 public replyData: any;
 public replyResult: any;
 public discussionsModel = new DiscussionsObject('', '', '');

 constructor(private router: Router, private route: ActivatedRoute, private discussionService: DiscussionsApiservice) {
   this.discussionService.currentMessage.subscribe(message => this.message = message);
   console.log('getting from service', this.message);

   this.discussionService.getThreadbyId(this.message.id).subscribe(data => {
     this.threadDetails = data['result'];
     this.loadReplyActions(this.threadDetails.thread.replies);
     console.log('get by ID', this.threadDetails);
   });
 }
 ngOnInit() {
   this.sub = this.route.params.subscribe(params => {
     console.log('param', params);
     this.id = params['id'];
   });
 }
 public loadReplyActions(replies) {
   console.log('inside loadReplyActions()', replies);
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
     console.log('../', this.replyActions);
   });
 }
 public undoActions(id, actionTypeId) {
   console.log('inside undoActions()', id, actionTypeId);
   this.discussionService.undoActions(id, actionTypeId).subscribe(data => {
     this.replyActions[id][actionTypeId] = 'can_act';
     console.log('../', this.replyActions);
   });
 }
 changeWidget() {
   console.log('inside changeWidget()');
   this.router.navigate(['migration/thread-list']);
 }
 ngOnDestroy() {
   this.sub.unsubscribe();
 }
 public submitReply() {   
   this.reply = { 
    'contextId': 'do_212390847580487680138',
    'description': this.discussionsModel.replyAnswer
  }
   this.discussionService.postReply(this.message.id,this.reply).subscribe(data => {
    if(data != undefined){
      this.successMessage = true;
   }
     this.replyData = data;
     this.replyResult = this.replyData.result.id;
     console.log('data from post reply is id', this.replyResult);
     this.loadReplies(this.replyResult);
   });
 }

 public loadReplies(threadId){
  this.discussionService.getThreadbyId(this.message.id).subscribe(data => {  
    this.replyData = data;
    this.replyResult = this.replyData.result.thread.replies;
          //$scope.loading = false
          //$scope.widget = 'reply-thread'
          console.log('load replies data, replyResult replies', data, this.replyResult)
          this.threadDetails = this.replyData.result;
          this.loadReplyActions(this.replyResult)
          //$scope.thread = data.result.thread
         // $scope.replyAnswer = ''
        });

  }
}
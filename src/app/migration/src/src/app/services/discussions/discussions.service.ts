import * as  urlConfig from './../../config/url.config.json';
import { Injectable } from '@angular/core';
import { Http, Response,RequestOptionsArgs } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from '../data/data.service';
import { UserService } from '../user/user.service';
import { ShareButtons } from '@ngx-share/core';
const urlConFig = (<any>urlConfig);
import { HttpClientModule } from '@angular/common/http';
// import {Http, } from '@angular/http';

@Injectable()
export class DiscussionsApiservice extends DataService {
    public messageSource = new BehaviorSubject<any>([]);
    currentMessage = this.messageSource.asObservable();
    private threadsURL = '/discussions/v1/list';
    public baseUrl = '';

    constructor(public http: HttpClient, public share: ShareButtons) {
        super(http, urlConFig.URLS.RESOURCEBUNDLES_PREFIX);
    }
    public changeMessage(object) {
        console.log('object from list comp', object);
        this.messageSource.next(object);
    }

    getThreads(communityId) {
        console.log('com', communityId);
        const option = {
            url: '/discussions/v1/list/',
            data: {
                communityId: communityId,
                type: 'qna'
            }
        };
        return this.post(option)
            .map((response: Response) => {
                console.log('Response: ', response);
                return response;
            });

    }
    public getThreadbyId(threadId) {
        const option = {
            url: `/discussions/v1/thread/` + threadId
        };
        return this.get(option)       
            .map((response: Response) => {
                console.log("inside getthread by id in dis service");
                return response;
            });
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

    postThread(model) {
        const body = {
           // url: '/discussions/v1/thread/create',
            title: model.threadTitle,
            body: model.threadDesc,
            contextId: '01245108888897126412',
            contextType: 'batch',
            type: 'qna' 
        };
        console.log('inside postThread()', body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/create`, body)       
            .map((response: Response) => {
                console.log("Response of post thread", response);
                return response;
            });            
    }
    editThread(model) {
        const body = {
            url: '/discussions/v1/thread/edit',
            title: model.threadTitle,
            id: model.threadId,
            communityId: 'do_212390847580487680138',
            contentType: 'ENROLLED',
            type: 'qna' 
        };
        return this.post(body)
        .map((response: Response ) => {
            return response;
        })
    }

    editReply(model) {
        const body = {
            url: '/discussions/v1/reply/edit',
            threadId: model.threadId,
            replyAnswer: model.replyAnswer,
          
        };
        console.log("editrreply in service", body);
        return this.post(body)
        .map((response: Response ) => {
            return response;
        })
    }

    upvoteAction(id, undo) {
        console.log('inside service actions()', id);
        const option = {
            url: `/discussions/v1/thread/vote`,
            data: {
                'postId': id,
                'value': 'up',
                'undo': undo
            }
        };
        return this.post(option).map((response: Response) => {
            return response;
        });
    }
    downvoteAction(id, undo) {
        console.log('inside service actions()', id);
        const option = {
            url: `/discussions/v1/thread/vote`,
            data: {
                'postId': id,
                'value': 'down',
                'undo': undo
            }
        };
        return this.post(option).map((response: Response) => {
            return response;
        });
    }
    flagAction(id, undo){
        const option ={
            url: `/discussions/v1/thread/flag`,
            data: {
                'postId': id               
            }
        };
        return this.post(option).map((response) => {
            return response;
        });

    }
    actions(id, actionTypeId) {
        console.log('inside service actions()', id, actionTypeId);
        const option = {
            url: `/discussions/v1/thread/actions/` + id,
            data: { 'actionTypeId': actionTypeId }
        };
        return this.post(option).map((response: Response) => {
            return response;
        });
    }
    undoActions(id, actionTypeId) {
        console.log('inside service actions()', id, actionTypeId);
        const option = {
            url: `/discussions/v1/thread/actions/` + id,
            data: { 'actionTypeId': actionTypeId, 'undo': true }
        };
        return this.post(option).map((response: Response) => {
            return response;
        });
    }
    markAsCorrect(replyId, isUndo) {
        console.log('inside mark as correct answer', replyId, isUndo);
        const body = {
            'postId': replyId,
            'undo': isUndo
        };
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/markanswer`, body)
            .map((response: Response) => {
                return response;
            });
    }
    postReply(threadId, model) {
        const body = {
            'threadId': threadId,
            'body': model.description
        };
        console.log('inside postReply()', body, threadId);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/reply/`, body)
            .map((response: Response) => {
                return response;
            });
    }
    lockAction(id, isLocked) {
        const body = {
            'id': id,
            'isLocked': isLocked
        };
        console.log('inside lockAction service', id, body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/lock/` + id, body)
            .map((response: Response) => {
                return response;
            });
    }
    spamAction(id, isSpam) {
        const body = {
            'id': id,
            'isSpam': isSpam
        };
        console.log('inside spam action service', id, body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/spam/` + id, body)
            .map((response: Response) => {
                return response;
            });
    }
    // archiveAction(id: string) {
    //     let body = 
    //         {
    //             'id': id                 
    //       };
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({
    //       headers: headers,
    //       body : body
    //     });
      
    //     return this.http.delete("/discussions/v1/thread/archive/", options)
    //           .map(res => this.extractData(res))
    //           .catch(this.handleError);



        


       
    // }
    
}

import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from './../../core/services/data/data.service';
import { UserService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { Headers } from '@angular/http';

@Injectable()
/**
 * DiscussionApiService extends dataservice where
 * get, post, delete etc methods are written
 */
export class DiscussionsApiservice extends DataService {
    public messageSource = new BehaviorSubject<any>([]);

    currentMessage = this.messageSource.asObservable();
    /**
   * base Url for Discussion api
   */
    baseUrl: string;
    /**
     * reference of config service.
     */
    public config: ConfigService;
    /**
     * reference of http service.
     */
    public http: HttpClient;
    /**
     * Constructor - default method of DiscussionApiService class
     *
     * @param {ConfigService} config ConfigService reference
     * @param {HttpClient} http HttpClient reference
     */

    constructor(config: ConfigService, http: HttpClient) {
        super(http);
        this.config = config;
        this.baseUrl = this.config.urlConFig.URLS.DISCUSSIONS_PREFIX;
    }
    /**
     * Read value from Thread list component
     * Using .next() method
     **/
    public changeMessage(object) {
        console.log('object from list comp', object);
        this.messageSource.next(object);
    }
    /**
     * Method to List thread from api call
     * It calls the post method from data service class
     **/

    getThreads(contextId: Number): Observable<ServerResponse> {
        console.log('com', contextId);
        const option = {
            url: this.config.urlConFig.URLS.DISCUSSIONS.DISPLAY_THREADS,
            data: {
                contextId: contextId,
                type: 'qna'
            }
        };
        return this.post(option)
    }
    /**
      * Method to Get thread by ID from api, GET method 
      **/
    public getThreadbyId(threadId: Number): Observable<ServerResponse> {
        const option = {
            url:this.config.urlConFig.URLS.DISCUSSIONS.THREAD_BY_ID + threadId
        };
        return this.get(option)
    }

    /**
     * Method to make read api call
     * It calls the post method from data service class
     **/

    postThread(contextId: Number|String, model){
        const body = {
            // url: '/discussions/v1/thread/create',
            title: model.threadTitle,
            body: model.threadDesc,
            contextId: contextId,
            contextType: 'batch',
            type: 'qna'
        };
        return this.http.post(`${this.baseUrl}/thread/create`, body)


        //  const options = {
        //     url:this.config.urlConFig.URLS.DISCUSSIONS.POST_THREAD,
        //     title: model.threadTitle,
        //     body: model.threadDesc,
        //     contextId: contextId,
        //     contextType: 'batch',
        //     type: 'qna'
        // };
        // return this.post(options)

    }
    /**
      * Method to Edit thread by ID from api, PATCH method 
      **/
    editThread(model) {
        const body = {
            //url: '/discussions/v1/thread/edit',
            title: model.threadTitle,
            threadId: model.threadId
        };
        return this.http.patch(`${this.baseUrl}/thread/edit`, body)

    }
    /**
      * Method to Edit reply by ID from api, PATCH method 
      **/
    editReply(model) {
        const body = {
            // url: '/discussions/v1/reply/edit',
            postId: model.threadId,
            body: model.replyAnswer,

        };
        console.log("edit reply in service", body);
        return this.http.patch(`${this.baseUrl}/reply/edit`, body)

    }
    /**     
        * Method to UpVote a thread     
        **/
    upvoteAction(id, undo) {
        console.log('inside service actions()', id);
        const option = {
            url: this.config.urlConFig.URLS.DISCUSSIONS.VOTE_THREAD,
            data: {
                'postId': id,
                'value': 'up',
                'undo': undo
            }
        };
        return this.post(option)
    }
    /**     
       * Method to DownVote a thread     
       **/
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
        return this.post(option)
    }
    /**     
       * Method to Flag a thread     
       **/
    flagAction(id, undo) {
        const option = {
            url: this.config.urlConFig.URLS.DISCUSSIONS.FLAG_THREAD,
            data: {
                'postId': id
            }
        };
        return this.post(option)

    }

    /**     
       * Method to Mark as correct answer     
       **/
    markAsCorrect(replyId, isUndo) {
        console.log('inside mark as correct answer', replyId, isUndo);
        const options = {
            'url':this.config.urlConFig.URLS.DISCUSSIONS.POST_REPLY,
            'postId': replyId,
            'undo': isUndo
        };
        return this.post(options)
    }
    /**     
       * Method to Reply to a thread     
       **/
    postReply(threadId, model) {
        const options = {
            'url': this.config.urlConFig.URLS.DISCUSSIONS.POST_REPLY,
            'threadId': threadId,
            'body': model.description
        };
        return this.post(options)
    }
    /**     
       * Method to Lock a thread     
       **/
    lockAction(id: Number) {
        const option = {
            url: this.config.urlConFig.URLS.DISCUSSIONS.THREAD_LOCK,
            data: {
                'threadId': id
            }
        };
        return this.delete(option).map(data => {
            return data;
        });
    }


    /**
     * Method to make delete api call
     * It calls the delete method from data service class
     *
     */
    archiveAction(id: string) {
        const option = {
            url: this.config.urlConFig.URLS.DISCUSSIONS.ARCHIVE_THREAD,
            data: {
                'threadId': id
            }
        };
        return this.delete(option)
    }
    /**     
     * Method to SPAM a thread     
     **/

    spamAction(id, isSpam) {
        const options = {
            url:this.config.urlConFig.URLS.DISCUSSIONS.ARCHIVE_THREAD,
            'id': id,
            'isSpam': isSpam
        };       
        return this.post(options)
    }
}

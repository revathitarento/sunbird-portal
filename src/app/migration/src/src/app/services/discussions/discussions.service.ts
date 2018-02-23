import * as  urlConfig from './../../config/url.config.json';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from '../data/data.service';
import { UserService } from '../user/user.service';
const urlConFig = (<any>urlConfig);

@Injectable()
export class DiscussionsApiservice extends DataService {
    public messageSource = new BehaviorSubject<any>([]);
    currentMessage = this.messageSource.asObservable();
    private threadsURL = '/discussions/v1/list/do_212390847580487680138';
    public baseUrl = '';

    constructor(public http: HttpClient) {
        super(http, urlConFig.URLS.RESOURCEBUNDLES_PREFIX);
        // this.userService.getUserProfile();
    }
    public changeMessage(object) {
        console.log('object from list comp', object);
        this.messageSource.next(object);
    }
    public getThreads() {
        const option = {
            url: '/discussions/v1/list/do_212390847580487680138'
        };
        return this.get(option)
            .map((response: Response) => {
                return response;
            });
    }
    public getThreadbyId(threadId) {
        const option = {
            url: `/discussions/v1/thread/` + threadId
        };
        return this.get(option)
            .map((response: Response) => {
                return response;
            });
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }
    postThread(model) {
        const body = {
            title: model.threadTitle,
            description: model.threadDesc,
            contextId: 'do_212390847580487680138'
        };
        console.log('inside postThread()', body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread`, body)
            .map((response: Response) => {
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
    markAsCorrects(replyId, isUndo) {
        console.log('inside mark as correct answer', replyId, isUndo);
        const body = {
            'id': replyId,
            'isUndo': isUndo
        };
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/replies/marksolution`, body)
            .map((response: Response) => {
                return response;
            });
    }
    postReply(threadId, model) {
        const body = model;
        console.log('inside postReply()', body, threadId);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/reply/` + threadId, body)
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
    deleteAction(id, isDeleted) {
        const body = {
            'id': id,
            'isDeleted': isDeleted
        };
        console.log('inside lockAction service', id, body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/delete/` + id, body)
            .map((response: Response) => {
                return response;
            });
    }
    archiveAction(id, isArchived) {
        const body = {
            'id': id,
            'isArchived': isArchived
        };
        console.log('inside lockAction service', id, body);
        return this.http.post(`${this.baseUrl}/discussions/v1/thread/archive/` + id, body)
            .map((response: Response) => {
                return response;
            });
    }
}

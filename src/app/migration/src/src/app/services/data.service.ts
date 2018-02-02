import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
  constructor(public http: HttpClient) { }

  get(url, header?) {
    const headerReq = header || this.prepareDefaultHeader();
    return this.http.get(url, headerReq);
  }

  post(url, resource) {
    return this.http.post(url, resource);
  }

  update(url, resource) {
    return this.http.patch(url + '/' + resource.id, JSON.stringify({ isRead: true }));
  }

  delete(url, id) {
    return this.http.delete(url + '/' + id);
  }

  private prepareDefaultHeader(headers?: HttpHeaders): object {
    headers = headers || new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('X-Consumer-ID', 'X-Consumer-ID');
    headers = headers.set('X-Device-ID', 'X-Device-ID');
    headers = headers.set('X-Org-code', 'AP');
    headers = headers.set('X-Source', 'web');
    headers = headers.set('ts', moment().format());
    headers = headers.set('X-msgid', UUID.UUID());

    return {
        headers: headers
    };
}
}

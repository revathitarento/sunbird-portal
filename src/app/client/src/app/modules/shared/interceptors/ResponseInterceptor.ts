import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { ToasterService } from './../services/toaster/toaster.service';
import { ResourceService } from './../services/resource/resource.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    /**
   * To show toaster(error, success etc) after any API calls.
   */
  public toasterService: ToasterService;
  public resourceService: ResourceService;
  count: number;

    constructor(toasterService: ToasterService, resourceService: ResourceService) {
       this.toasterService = toasterService;
       this.resourceService = resourceService;
       this.count = 0;
    }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // addToken() returns headers, getAuthToken() returns token
  return next.handle(req).do((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      // success
      this.count = 0;
    }
  }, (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401 && this.count === 0) {
        console.log('interceptor called');
        this.toasterService.error(this.resourceService.messages.fmsg.m0082);
        this.count++;
      }
    }
  });
}
}

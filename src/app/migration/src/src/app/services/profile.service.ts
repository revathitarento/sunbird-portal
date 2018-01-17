import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { Observable } from "rxjs/Rx"
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from "lodash";
import { HttpHeaders } from '@angular/common/http';
declare var jquery:any;
declare var $ :any;

@Injectable()
export class ProfileService extends DataService {
  userid: string; 
  readUserProfileUrl: string;
  rolesAndPermissions : any[];
  currentUserProfile : object;
  currentUserRoles : any[];
  currentRoleActions : any[];

  constructor(public http : HttpClient) { 
    super(http);
    this.userid = $('#userId').attr('value');
    this.readUserProfileUrl = "/private/service/v1/learner/user/v1/read/";
    this.rolesAndPermissions = []; // permission sevrvice
    this.currentUserProfile = {};
    this.currentUserRoles = [];
    this.currentRoleActions = [];

    this.getUserProfile().subscribe(
      data => {
        this.setCurrentUserProfile(data);
      },
      err => { 
        console.log("error in getting profile",err);
      }
    );
  }
  public getUserProfile(){
    return  this.http.get(this.readUserProfileUrl + this.userid,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
                                  .set("Accept", 'application/json')
                                  .set('X-Consumer-ID', 'X-Consumer-ID')
                                  .set('X-Device-ID', 'X-Device-ID')
                                  .set('X-Org-code', 'AP')
                                  .set('X-Source', 'web')
                                  .set("ts", moment().format())
                                  .set('X-msgid', UUID.UUID())
      })
  }

  public setCurrentUserProfile(res){
    if (res && res.responseCode === 'OK') {
      var profileData = res.result.response
      var userRoles = profileData.roles
      _.forEach(profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles)
        }
      })
      this.currentUserProfile = profileData;
      this.currentUserRoles = userRoles;
      this.setCurrentRoleActions(userRoles);
    } else {
      // TODO: allow only public permissions
    }
  }

  public setCurrentRoleActions(userRoles){
    _.forEach(userRoles,  (r) => {
      var roleActions = _.filter(this.rolesAndPermissions, { role: r })
      if (_.isArray(roleActions) && roleActions.length > 0) {
        this.currentRoleActions = _.concat(this.currentRoleActions,
          _.map(roleActions[0].actions, 'id'))
      }
    })
  }
}

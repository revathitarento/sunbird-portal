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
export class PermissionService extends DataService {
  userid: string; 
  readPermissionsUrl: string;
  rolesAndPermissions : any[];
  mainRoles : any[];

  constructor(public http : HttpClient) { 
    super(http);
    this.userid = $('#userId').attr('value');
    this.readPermissionsUrl = "/private/service/v1/learner/data/v1/role/read"; //config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.ROLES.READ;
    this.rolesAndPermissions = [];
    this.mainRoles = [];
    this.getPermissionsData().subscribe(
      data => { 
        this.setRolesAndPermissions(data);
      },
      err => { 
        console.log("error in getting permission",err);     
      }
    );
  }
  public getPermissionsData() {
    let instance = this;
    return this.http.get(this.readPermissionsUrl,{
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
  public setRolesAndPermissions(data){
    var rolePermissions = _.cloneDeep(data.result.roles)
    _.forEach(rolePermissions, (r, p) => {
      var mainRole = { role: r.id, actions: [], roleName: r.name };
      this.mainRoles.push(mainRole)
      _.forEach(r.actionGroups, (ag) => {
        var subRole = { role: ag.id, actions: ag.actions, roleName: ag.name }
        mainRole.actions = _.concat(mainRole.actions, ag.actions)
        this.rolesAndPermissions.push(subRole)
      })
      this.rolesAndPermissions.push(mainRole)
    })
    this.rolesAndPermissions = _.uniqBy(this.rolesAndPermissions, 'role')
  }
}

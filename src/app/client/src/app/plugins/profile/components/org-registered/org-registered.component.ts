import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {  ConfigService, ResourceService , ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { SearchService, ContentService, SearchParam } from '@sunbird/core';

@Component({
  selector: 'app-org-registered',
  templateUrl: './org-registered.component.html',
  styleUrls: ['./org-registered.component.css']
})
export class OrgRegisteredComponent implements OnInit {

  
  orgReg : FormGroup;
  showModal: boolean = false;
  languages: Array<string>;
  orgs: any;
  
  constructor(public activatedRoute: ActivatedRoute, public config: ConfigService,public content : ContentService, public resourceService: ResourceService,) {
    this.languages = this.config.dropDownConfig.COMMON.languages;
    console.log("lang",this.languages);
    this.getOrgList();
   }
  
    ngOnInit() {
     this.orgReg = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.pattern('^[-\\w\.\\$@\*\\!]{5,256}$')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s@#!$?*^&0-9]*(?<! )$')]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s]*(?<! )$')]),
      lastName: new FormControl(null),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{10}$')]),
      email: new FormControl(null, [Validators.required,
      Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      language: new FormControl(null, [Validators.required]),
      organization: new FormControl(null,[Validators.required])
    });
  
    }

    getOrgList() {
      this.orgSearch().subscribe((resp) => {
        this.orgs = resp.result && resp.result.response && resp.result.response.content || [];
        this.orgs = _.map(this.orgs, (obj) => {
            return { 'id': obj.id, 'orgName': obj.orgName };
        });
        console.log(this.orgs);
      });
  
    }

    orgSearch(): Observable<ServerResponse> {
      const option = {
        url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
        data: {
          request: {
            filters: {},
            sort_by: {orgName: 'asc'}
          }
        }
      };
      return this.content.post(option);
    }
  
    openModal()
    {
    this.showModal=true;
    }
    closeModal()
    {
      this.showModal =false;  
    }
  }
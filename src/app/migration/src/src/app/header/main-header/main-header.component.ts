import { PermissionService } from './../../services/permission.service';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})

export class MainHeaderComponent implements OnInit {
  userid: string; 
  userProfile; object;
  constructor(private permissionService: PermissionService, private profileService: ProfileService) { 
  }

  ngOnInit() {

  }

}
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of Router.
   */
  private router: Router;
  workSpaceRole: any;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router, 
    public permissionService: PermissionService, public config: ConfigService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.router = router;
  }

  ngOnInit() {
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
  }
}

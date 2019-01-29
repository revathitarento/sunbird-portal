import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of Router.
   */
  private router: Router;

  date = new Date();
  public appUrl: string;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, router: Router) {
    this.resourceService = resourceService;
    this.router = router;
   }

  ngOnInit() {
    this.appUrl = (<HTMLInputElement>document.getElementById('appUrl')).value;
  }

}

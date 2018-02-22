import { Announcement } from './../../../../interfaces/announcement';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '../../../../services/resource/resource.service';
import { AnnouncementService } from '../../../../services/announcement/announcement.service';
import * as _ from 'lodash';
import * as moment from 'moment';
/**
 * this is a shared component contains announcement inbox list
 */
@Component({
  selector: 'app-announcement-inbox-card',
  templateUrl: './announcement-inbox-card.component.html',
  styleUrls: ['./announcement-inbox-card.component.css']
})

export class AnnouncementInboxCardComponent implements OnInit {
  /**
     * Local reference of ResourceService
     */
    resourceService: ResourceService;
    /**
     * Local reference of AnnouncementService
     */
    announcementService: AnnouncementService;
  /**
     *  get the values from Announcement
     */
  @Input() item: Announcement;
  /**
   * the "constructor"
   *
   * @param {ResourceService} resourceService  get framelements and messages
   * @param {AnnouncementService} announcementService get announcement details
   */

  constructor( resourceService: ResourceService, announcementService: AnnouncementService ) {
    this.resourceService = resourceService;
    this.announcementService = announcementService;
   }

  ngOnInit() {
  }

}

import { CourseBatchService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { PermissionService, UserService } from '@sunbird/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.css']
})
export class BatchDetailsComponent implements OnInit {
  batchStatus: Number;
  @Input() courseId: string;
  @Input() enrolledCourse: boolean;
  @Input() batchId: string;
  courseMentor = false;
  batchList = [];
  userList = [];
  showError = false;
  userNames = {};
  showBatchList = false;
  enrolledBatchInfo: any;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
  public userService: UserService, public batchService: CourseBatchService, public toasterService: ToasterService,
  public router: Router, public activatedRoute: ActivatedRoute) {
    this.batchStatus = this.statusOptions[0].value;
  }

  ngOnInit() {
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    if (this.enrolledCourse === true) {
      this.getEnrolledCourseBatchDetails();
    } else {
      this.getAllBatchDetails();
    }
    this.batchService.updateEvent.subscribe((data) => {
      this.getAllBatchDetails();
    });
  }
  getAllBatchDetails() {
    this.showBatchList = false;
    this.showError = false;
    this.batchList = [];
    const searchParams: any = {
      filters: {
        status: this.batchStatus.toString(),
        courseId: this.courseId
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    if (this.courseMentor) {
      searchParams.filters.createdBy = this.userService.userid;
    } else {
      searchParams.filters.enrollmentType = 'open';
    }
    this.batchService.getAllBatchDetails(searchParams).subscribe((data: ServerResponse) => {
      if (data.result.response.content && data.result.response.content.length > 0) {
        this.batchList = data.result.response.content;
        this.fetchUserDetails();
      } else {
        this.showBatchList = true;
      }
    },
    (err: ServerResponse) => {
      this.showError = true;
      this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  getEnrolledCourseBatchDetails() {
    this.batchService.getBatchDetails(this.batchId).subscribe((data: ServerResponse) => {
      this.enrolledBatchInfo = data.result.response;
      this.enrolledBatchInfo.participant = this.enrolledBatchInfo.participant ? this.enrolledBatchInfo.participant : [];
    }, () => {
      // handle error
    });
  }
  fetchUserDetails() {
    _.forEach(this.batchList, (val) => {
      this.userList.push(val.createdBy);
    });
    this.userList = _.compact(_.uniq(this.userList));
    const request =  {
      filters: {
        identifier: this.userList
      }
    };
    this.batchService.getUserDetails(request).subscribe((res) => {
      _.forEach(res.result.response.content, (user) =>  {
        this.userNames[user.identifier] = user;
      });
      this.showBatchList = true;
    }, (err) => {
      this.showError = true;
    });
  }
  batchUpdate(batch) {
    this.batchService.setUpdateBatchDetails(batch);
    this.router.navigate(['update/batch', batch.identifier], {relativeTo: this.activatedRoute} );
  }
  createBatch() {
    this.router.navigate(['create/batch'], {relativeTo: this.activatedRoute});
  }
  enrollBatch(batch) {
    this.batchService.setEnrollBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], {relativeTo: this.activatedRoute});
  }
}

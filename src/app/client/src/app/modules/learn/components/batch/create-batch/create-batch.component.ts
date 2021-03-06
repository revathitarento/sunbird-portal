import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService } from './../../../../workspace/services';
import { UserService } from '@sunbird/core';
import { WorkSpace } from './../../../../workspace/classes/workspace';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit, OnDestroy {

  @ViewChild('createBatchModel') createBatchModel;
  /**
  * batchId
  */
  batchId: string;
  showCreateModal = false;
  disableSubmitBtn = true;
  courseId: string;
  orgIds: Array<string>;
  /**
  * courseCreatedBy
  */
  courseCreatedBy: string;
  /**
  * userList for mentorlist
  */
  userList = [];

  /**
  * batchData for form
  */
  batchData: any;
  /**
  * menterList for mentors in the batch
  */
  mentorList: Array<any> = [];

  /**
  * userId for checking the enrollment type.
  */
  userId: string;
  /**
   * form group for batchAddUserForm
  */
  createBatchUserForm: FormGroup;
  /**
  * To navigate to other pages
  */
  router: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to update batch  component
  */
  private activatedRoute: ActivatedRoute;
  /**
  * Refrence of UserService
  */
  private userService: UserService;
  /**
  * Refrence of UserService
  */
  private courseBatchService: CourseBatchService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  public courseConsumptionService: CourseConsumptionService;
  pickerMinDate = new Date();
  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {Router} router Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
  */
  constructor(routerNavigationService: RouterNavigationService,
    activatedRoute: ActivatedRoute,
    route: Router,
    resourceService: ResourceService, userService: UserService,
    courseBatchService: CourseBatchService,
    toasterService: ToasterService,
    courseConsumptionService: CourseConsumptionService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.courseConsumptionService = courseConsumptionService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.orgIds = userdata.userProfile.organisationIds;
        this.initializeFormFields();
      }
    });
    this.getUserList();
    this.activatedRoute.parent.params.subscribe(params => {
      this.courseId = params.courseId;
      this.getCourseData();
    });
  }
  ngOnDestroy() {
    if (this.createBatchModel && this.createBatchModel.deny) {
      this.createBatchModel.deny();
    }
  }
  getCourseData() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId).subscribe((res) => {
      this.courseCreatedBy = res.createdBy;
    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    });
  }

  createBatch() {
    this.disableSubmitBtn = false;
    const requestBody = {
      'courseId': this.courseId,
      'name': this.createBatchUserForm.value.name,
      'description': this.createBatchUserForm.value.description,
      'enrollmentType': this.createBatchUserForm.value.enrollmentType,
      'startDate': this.createBatchUserForm.value.startDate,
      'endDate': this.createBatchUserForm.value.endDate,
      'createdBy': this.userId,
      'createdFor': this.orgIds,
      'mentors': this.createBatchUserForm.value.mentors
    };
    this.courseBatchService.createBatch(requestBody).subscribe((response) => {
      if (this.createBatchUserForm.value.users && this.createBatchUserForm.value.users.length > 0) {
        this.addUserToBatch(response.result.batchId);
      } else {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      }
    },
    (err) => {
      this.disableSubmitBtn = true;
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
      }
    });
  }
  addUserToBatch(batchId) {
    const userRequest = {
      userIds: this.createBatchUserForm.value.users
    };
    setTimeout(() => {
      this.courseBatchService.addUsersToBatch(userRequest, batchId).subscribe((res) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      },
      (err) => {
        this.disableSubmitBtn = true;
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0053);
        }
      }
    );
    }, 1000);
  }
  redirect() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
  reload() {
    this.courseBatchService.updateEvent.emit({event: 'create'});
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

  /**
  * It helps to initialize form fields and apply field level validation
  */
  initializeFormFields(): void {
    this.createBatchUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      enrollmentType: new FormControl('invite-only', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date()),
      mentors: new FormControl(''),
      users: new FormControl(''),
    });
    this.showCreateModal = true;
    this.createBatchUserForm.valueChanges.subscribe(val => {
      this.enableButton();
    });
  }

  enableButton() {
    const data = this.createBatchUserForm ? this.createBatchUserForm.value : '';
    if (this.createBatchUserForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }
  /**
  *  api call to get user list
  */
  getUserList() {
    const requestBody = {
      filters: {}
    };
    this.courseBatchService.getUserList(requestBody).subscribe((res) => {
      this.formatUserList(res);
    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    });
  }
  formatUserList(res) {
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.identifier,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            otherDetail: this.getUserOtherDetail(userData)
          };
          _.forEach(userData.organisations, (userOrgData) => {
            if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
              this.mentorList.push(user);
            }
          });
          this.userList.push(user);
        }
      });
      this.userList = _.uniqBy(this.userList, 'id');
      this.mentorList = _.uniqBy(this.mentorList, 'id');
    }
  }
  getUserOtherDetail(userData) {
    if (userData.email && userData.phone) {
      return ' (' + userData.email + ', ' + userData.phone + ')';
    }
    if (userData.email && !userData.phone) {
      return ' (' + userData.email + ')';
    }
    if (!userData.email && userData.phone) {
      return ' (' + userData.phone + ')';
    }
  }
}




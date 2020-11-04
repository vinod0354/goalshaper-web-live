import { Component, OnInit, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/global/app.global.service';
import { UserLog } from 'src/app/models/userLog';
import { UserService, EnterpriseService } from 'src/app/services';
import swal from 'sweetalert2';
import { combineAll } from 'rxjs/operators';


@Component({
  selector: 'app-objectives-create',
  templateUrl: './objectives-create.component.html',
  styleUrls: ['./objectives-create.component.css']
})
export class ObjectivesCreateComponent implements OnInit {
  public modalType;
  public modalData;
  public ToSelectGoalId = [];
  ButtonText: string = 'Save Objective';
  scheduledMinDate = new Date();
  targetMinDate = new Date();
  completedMinDate = new Date();
  userLogs: UserLog = new UserLog();
  public allMileStones = [];
  ObjectiveInfo: any = {
    objective: '',
    description: '',
    objective_type: '',
    // scheduledDate:'',
    targetDate: '',
    completedDate: '',
    goal_id: '',
    milestone_id: ''

  }
  public eventT: EventEmitter<any> = new EventEmitter();
  constructor(public datepipe: DatePipe, public bsModalRef: BsModalRef, public globals: GlobalService, public userService: UserService, public enterpriseService: EnterpriseService) {
  //Initial Load to get objective type
  this.Toloadobjectivetype();
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  //To change the min dates based on scheduledDate
  changeDate(event: any) {
    console.log(event);
    this.targetMinDate = new Date();
    this.completedMinDate = new Date();
  }
  globaluserID: string;
  ngOnInit() {
    this.completedMinDate = new Date();
    this.globaluserID = this.globals.currentUserId
    this.TogetAllGoalsInfoObjectivePage();
    // this.Toloadobjectivetype();
    console.log('*******');
    console.log(this.modalType)
    console.log(this.modalData);
    if (this.modalType == 'create') {
      this.ObjectiveInfo = {
        "objective": "",
        "description": "",
        // "scheduledDate":new Date(),
        "objective_type": "",
        "targetDate": "",
        "completedDate": "",
        "milestone_id": "",
        "goal_id": "",
        "goal_category_id": "",
        "objective_level_id": ""
      };

      this.ButtonText = 'Save Objective';

    } else {

      this.ObjectiveInfo = {
        "objective": this.modalData.objective,
        "description": this.modalData.description,
        // "scheduledDate":new Date(this.modalData.scheduled_date),
        "objective_type": this.modalData.objective_type.toString(),
        "targetDate": new Date(this.modalData.target_date),
        "completedDate": (this.modalData.completed_date) && (!this.modalData.completed_date.includes('1900')) ? new Date(this.modalData.completed_date) : '',
        // "completedDate": new Date(this.modalData.completed_date),
        "milestone_id": this.modalData.milestone_id,
        "goal_id": this.modalData.goal_id,
        "goal_category_id": this.modalData.goal_category_id ? this.modalData.goal_category_id : "null",
        "objective_level_id": this.modalData.objective_level_id,
      };
      console.log(this.ObjectiveInfo)
      this.ButtonText = 'Update Objective';
      console.log(this.ObjectiveInfo.objective_type);
      console.log(this.modalData.objective_type)
      //  this.ObjectiveInfo.objective_type=this.modalData.objective_type;
    }
    if (this.modalType != 'create') {
      this.ToloadMilestones();
      this.scheduledMinDate = new Date(this.modalData.scheduled_date);
      // this.targetMinDate = new Date(this.modalData.target_date);
      // this.completedMinDate = new Date(this.modalData.completed_date);
      this.targetMinDate = new Date();
      this.completedMinDate = new Date();
    }
    // //Initial Load to get objective type
    // this.Toloadobjectivetype();

    //Initial Load for selecting category
    this.Toloadcategory();

    //Intial Load to get goallevels
    this.TogetGoalLevels();

  }

  //To load Objective category
  public currentUserId: string = '';
  public currentEnterpriseID: string = '';
  public currentRoleID: string = '';
  public Objectivecategory = [];
  public Objectivecategory_else = [];
  Toloadcategory() {
    var currentUser: any = localStorage.getItem('currentUser');
    console.log("curentuser", currentUser);
    currentUser = JSON.parse(currentUser);
    this.currentUserId = currentUser.user.user_id;
    this.currentEnterpriseID = currentUser.user.enterprise_id;
    this.currentRoleID = currentUser.user.role_id
    console.log(this.currentUserId)
    console.log(this.currentEnterpriseID)
    this.enterpriseService.getCategories(this.currentEnterpriseID, this.currentUserId).subscribe(result => {
      console.log(result);
      if (this.currentRoleID == '4') {
        this.Objectivecategory = result.body;
        const found = this.Objectivecategory.find(element => element.name == 'Miscellaneous')
        console.log(found.category_id);
        if(this.modalType == 'create'){
          this.ObjectiveInfo.goal_category_id = found.category_id;
        }else{
          this.ObjectiveInfo.goal_category_id = this.modalData.goal_category_id;
        }
        
      } else {
        this.Objectivecategory_else = result.body;
        const found = this.Objectivecategory_else.find(element => element.name == 'Miscellaneous')
        console.log(found.category_id)
        this.ObjectiveInfo.goal_category_id = found.category_id;
      }
    },
    (err) => {
      this.globals.showErrorMessage('Something went wrong. Please try later!');
      console.log(err);
    });
  }

  // To Get the objective Type;
  objectivetype: any
  objectiveType: number
  Toloadobjectivetype() {
    let enterpriseID = this.globals.currentEnterpriseId;
    this.enterpriseService.ToloadobjectivetypeServices(enterpriseID).subscribe(
      (result) => {
        this.objectivetype = result.body;
        console.log('*****');
        console.log(this.objectivetype);
        if(this.modalType == 'create'){
          this.ObjectiveInfo.objective_type = result.body[0].goal_type_id ? result.body[0].goal_type_id : "";
        }
      },
      (err) => {
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log(err);
      });
  }

  //To load GoalLevels
  public goallevelarray = []
  TogetGoalLevels() {
    this.enterpriseService.getGoalLevels(this.globals.currentEnterpriseId).subscribe(result => {
      console.log(result.body);
      this.goallevelarray = result.body;
      console.log(this.currentRoleID);
      if (this.currentRoleID == '2') {
        console.log("2")
        const GoalLevel_id = this.goallevelarray.find(element => element.level_name == "Enterprise")
        console.log(GoalLevel_id.level_id);
        this.ObjectiveInfo.objective_level_id = GoalLevel_id.level_id;
      }
      if (this.currentRoleID == '3') {
        console.log("3")
        const GoalLevel_id = this.goallevelarray.find(element => element.level_name == "Team")
        console.log(GoalLevel_id.level_id);
        this.ObjectiveInfo.objective_level_id = GoalLevel_id.level_id;
      }
      if (this.currentRoleID == '4') {
        console.log("4")
        const GoalLevel_id = this.goallevelarray.find(element => element.level_name == "Individual")
        console.log(GoalLevel_id.level_id);
        this.ObjectiveInfo.objective_level_id = GoalLevel_id.level_id;
      }
    },
    (err) => {
      this.globals.showErrorMessage('Something went wrong. Please try later!');
      console.log(err);
    })
  }

  //To Load list of Goals
  TogetAllGoalsInfoObjectivePage() {
    var TogetObjectiveInfodetailsfromlocalStorage = JSON.parse(localStorage.getItem("currentUser"));
    let ForGoalEnterpriseID = TogetObjectiveInfodetailsfromlocalStorage.user.enterprise_id;
    this.enterpriseService.getAllGoalsInfoObjectivePage(ForGoalEnterpriseID, this.globals.currentUserId).subscribe(
      (result) => {
        console.log(result.body);
        this.ToSelectGoalId = result.body
        // this.createUserLog('Goal created successfully.',JSON.stringify(this.goalInfo));

      },
      (err) => {
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log(err);
      });
  }

  //To save Objectives
  saveObjectives() {
    let savingObjectiveInfo = this.ObjectiveInfo;
    console.log(savingObjectiveInfo);
    savingObjectiveInfo.objective_type = this.ObjectiveInfo.objective_type;
    // savingObjectiveInfo.scheduled_date=this.ObjectiveInfo.scheduledDate.toISOString();
    // this.datepipe.transform(this.ObjectiveInfo.scheduledDate, 'yyyy-MM-dd hh:mm:ss')
    savingObjectiveInfo.target_date = this.ObjectiveInfo.targetDate.toISOString();
    if (this.ObjectiveInfo.completedDate) {
      console.log("if part")
      savingObjectiveInfo.completed_date = this.ObjectiveInfo.completedDate.toISOString();
    } else {
      console.log("elsepart")
      savingObjectiveInfo.completed_date = null;
    }
    var TogetObjectiveInfodetailsfromlocalStorage = JSON.parse(localStorage.getItem("currentUser"));
    console.log(TogetObjectiveInfodetailsfromlocalStorage)
    console.log(TogetObjectiveInfodetailsfromlocalStorage.user.enterprise_id);
    savingObjectiveInfo.enterprise_id = TogetObjectiveInfodetailsfromlocalStorage.user.enterprise_id;
    savingObjectiveInfo.created_user_id = TogetObjectiveInfodetailsfromlocalStorage.user.user_id;
    this.globals.showLoading('Please wait');
    console.log(savingObjectiveInfo);
    if (this.modalType == 'create') {
      this.enterpriseService.createObjective(JSON.stringify(savingObjectiveInfo)).subscribe(
        (result) => {
          console.log("POSTED GOAL SUCCESSFULLY");
          console.log(result);
          // this.sweetAlertDisplay("Objective created successfully", true);
          this.eventT.emit('true');
          this.bsModalRef.hide();
          if (result.status == 200) {
            this.ToSaveObjectiveActivity(result.body);
          }

          // this.createUserLog('Goal created successfully.',JSON.stringify(this.goalInfo));

        }, (err) => {
          this.globals.showErrorMessage('Something went wrong. Please try later!');
          console.log("POSTED Objective FAILED");
          console.log(err);
        });
    } else {
      let id = this.modalData.objective_id;
      console.log(id)
      savingObjectiveInfo.modified_user_id = TogetObjectiveInfodetailsfromlocalStorage.user.user_id;
      console.log(savingObjectiveInfo)
      this.enterpriseService.updateObjective(JSON.stringify(savingObjectiveInfo), id).subscribe(
        (result) => {
          console.log("UPDATED GOAL SUCCESSFULLY");
          console.log(result);
          // this.sweetAlertDisplay("Objective updated successfully", true);
          this.eventT.emit('true');
          this.bsModalRef.hide();
          if (result.status == 200) {
            this.ToSaveObjectiveActivity(result.body);
          }
          // this.createUserLog('Goal created successfully.',JSON.stringify(this.goalInfo));

        }, (err) => {
          this.globals.showErrorMessage('Something went wrong. Please try later!');
          console.log("UPDATED Objective FAILED");
          console.log(err);
        });
    }
  }

  //To save the Objective Activities
  ToSaveObjectiveActivity(data) {
    console.log("return data", data);
    if (this.modalType == "create") {
      var activityObjecctivesId = data.objective_id;
    } else {
      var activityObjecctivesId = this.modalData.objective_id;
    }
    let objective_action = data.message;
    let activityUserId = this.globals.currentUserId;
    let activityenterpriseId = this.globals.currentEnterpriseId;
    let ActivityInfo = {
      "objective_id": activityObjecctivesId,
      "objective_action": objective_action,
      "enterprise_id": activityenterpriseId,
      "user_id": activityUserId
    }
    this.enterpriseService.ToSaveObjectiveActivityService(ActivityInfo).subscribe(
      (result) => {
        console.log(result)
      },
      (err) => {
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log(err);
      })

  }

  //To load Milestones Based on goal Id
  ToloadMilestones() {
    console.log(this.ObjectiveInfo.goal_id);
    var TogetObjectiveInfodetailsfromlocalStorage = JSON.parse(localStorage.getItem("currentUser"));
    var EnterPriseId = TogetObjectiveInfodetailsfromlocalStorage.user.enterprise_id;
    var SelectedGoalId = this.ObjectiveInfo.goal_id;
    console.log(EnterPriseId);
    this.globals.showLoading('Please wait');
    this.enterpriseService.ToloadMilestonesService(EnterPriseId, SelectedGoalId).subscribe(
      (result) => {
        console.log(result.body);
        if (result.status == 200) {
          this.globals.hideLoading('Please wait');
          this.allMileStones = result.body;
        } else {
          this.globals.hideLoading('Please wait');
        }

      }
      , (err) => {
        this.globals.hideLoading('Please wait');
        this.globals.showErrorMessage('Something went wrong. Please try later!');


      });
  }


  //SweerAlert for PopUp
  sweetAlertDisplay(title, status) {
    if (status == true) {
      swal.fire({
        title: title,
        //html: '<span style="font-size:medium; color: #0072bb;">Enterprise will be listed in Home page</span>',
        allowEscapeKey: false,
        showCloseButton: false,
        imageUrl: 'assets/img/OK-48.png',
        allowOutsideClick: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      }).then((result) => {
        if (result.value) {
          this.eventT.emit('true');
          this.bsModalRef.hide();
        }
      });
    } else {
      swal.fire({
        title: title,
        html: '<span style="font-size:medium; color: #0072bb;">Something went wrong!! Try Again</span>',
        allowEscapeKey: false,
        showCloseButton: false,
        imageUrl: 'assets/img/OK-48.png',
        allowOutsideClick: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      }).then((result) => {
        if (result.value) {
          //Do Nothing
        }
      });
    }
  }





}

import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/global/app.global.service';
import { UserLog } from 'src/app/models/userLog';
import { UserService, EnterpriseService } from 'src/app/services';
import { DatePipe } from '@angular/common'
import swal from 'sweetalert2';
import { TabHeadingDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-goals-create',
  templateUrl: './goals-create.component.html',
  styleUrls: ['./goals-create.component.css']
})
export class GoalsCreateComponent implements OnInit {

  public modalType;
  public modalData;
  public modalCategories;

  ButtonText: string = 'Save Goal';
  scheduledMinDate = new Date();
  targetMinDate = this.scheduledMinDate;
  completedMinDate = this.targetMinDate;
  userLogs: UserLog = new UserLog();
  goalInfo: any = {
    "goal_type_id": "1",
    "scheduled_date":"",
    "target_date": "",
    "enterprise_id": 0,
    "created_user_id": 0,
    "modified_user_id": 0,
    "goal_members": "",
    "goal_title": "",
    "description": "",
    "completed_date": "",
    "remarks": "nothing",
    "goal_level_id": 0,
    "goal_category_id":''
  }

  golasActivityData = {
    "goal_id": 0,
    "goal_action": "",
    "enterprise_id": 0,
    "user_id": 0
  };

  milestoneActivityData = {
    "milestone_id": 0,
    "milestone_action": "string",
    "enterprise_id": 0,
    "user_id": 0,
    "goal_id": 0
  }
  milestoneIdData = [
    {
      "milestone_id":0
    },{
      "milestone_id":0
    },
    {
      "milestone_id":0
    },{
      "milestone_id":0
    }
  ];

  milestonesData: any= [{
    "milestone": "",
    "target_date": "",
    "enterprise_id": 0,
    "completion_date": "",
    "goal_id": 0,
    "milestone_number": 0
  }, {
    "milestone": "",
    "target_date": "",
    "enterprise_id": 0,
    "completion_date": "",
    "goal_id": 0,
    "milestone_number": 0
  }, {
    "milestone": "",
    "target_date": "",
    "enterprise_id": 0,
    "completion_date": "",
    "goal_id": 0,
    "milestone_number": 0
  }, {
    "milestone": "",
    "target_date": "",
    "enterprise_id": 0,
    "completion_date": "",
    "goal_id": 0,
    "milestone_number": 0
  }];

  milestonesNumberCount = [];
  goal_Types = [];
  show_category = false;
  diable_update_button = false;

  currentUserInfo: any;
  public eventT: EventEmitter<any> = new EventEmitter();
  constructor(public datepipe: DatePipe,public bsModalRef: BsModalRef, public globals: GlobalService, public userService: UserService, public enterpriseService: EnterpriseService) {
    //this.targetMinDate.setDate(this.targetMinDate.getDate() - 1);
    //this.goalInfo.completedDate.setDate(this.goalInfo.completedDate.getDate() + 1);
    let profileData = localStorage.getItem('currentUser');
    this.currentUserInfo = JSON.parse(profileData).user;
    this.getGoalLevels();
    this.getGoalTypes();
  }

  ngOnInit() {

    console.log("Received Data : ");
    console.log(this.modalData);
    console.log(this.modalType)
    console.log(this.modalCategories);
    console.log(this.globals.currentUserRoleId);

    if (this.modalType == 'create') {
      this.goalInfo = {
        "goal_type_id": "1",
        "goal_title": "",
        "description": "",
        "scheduled_date":"",
        "target_date":"",
        "completed_date": "",
        "goal_category_id":''
      };

      this.ButtonText = 'Save Goal';

    } else {
      this.goalInfo = {
        "goal_type_id": this.modalData.goal_type_id,
        "goal_title": this.modalData.goal_title,
        "description": this.modalData.description,
        "scheduled_date": (this.modalData.scheduled_date) && (!this.modalData.scheduled_date.includes('1900'))  ? new Date(this.modalData.scheduled_date) : '',
        "target_date": (this.modalData.target_date) && (!this.modalData.target_date.includes('1900')) ?  new Date(this.modalData.target_date) : '',
        "completed_date": (this.modalData.completed_date) && (!this.modalData.completed_date.includes('1900')) ? new Date(this.modalData.completed_date) : '',
        "goal_category_id": this.modalData.goal_category_id ? this.modalData.goal_category_id : ''
      };

      if(this.modalData.created_user_id != this.globals.currentUserId){
        this.diable_update_button = true;
      }
      // this.scheduledMinDate = new Date(this.modalData.scheduled_date);
      this.scheduledMinDate = new Date();
      this.targetMinDate = this.scheduledMinDate;
      this.completedMinDate = this.targetMinDate;
      this.ButtonText = 'Update Goal';
      this.milestonesNumberCount = [];
      this.getmileStones();
      console.log("Goal Info");
      console.log(this.goalInfo);
    }
  }


  onChangeCategory(event){

    console.log("Category changed");
    console.log(event);

  }


  closeModal() {
    this.bsModalRef.hide();
  }

  saveGoals() {


    console.log('Goal Type Id:' + this.goalInfo.goal_type_id);

    let savingGoalInfo={
      "goal_type_id": this.goalInfo.goal_type_id,
      "scheduled_date":this.goalInfo.scheduled_date,
      "target_date": this.goalInfo.target_date,
      "enterprise_id":this.goalInfo.enterprise_id,
      "created_user_id": this.goalInfo.created_user_id,
      "modified_user_id":this.goalInfo.modified_user_id,
      "goal_members": this.goalInfo.goal_members,
      "goal_title": this.goalInfo.goal_title,
      "description": this.goalInfo.description,
      "completed_date": this.goalInfo.completed_date,
      "remarks": this.goalInfo.remarks ? this.goalInfo.remarks : "",
      "goal_level_id": this.goalInfo.goal_level_id,
      "goal_category_id":this.goalInfo.goal_category_id
    };



    if (savingGoalInfo.scheduled_date != '' && savingGoalInfo.scheduled_date != null) {
      savingGoalInfo.scheduled_date = savingGoalInfo.scheduled_date.toISOString();
    }
    if (savingGoalInfo.target_date != '' && savingGoalInfo.target_date != null) {
      savingGoalInfo.target_date = savingGoalInfo.target_date.toISOString();
    }

    if (savingGoalInfo.completed_date != '' && savingGoalInfo.completed_date != null) {
      savingGoalInfo.completed_date = savingGoalInfo.completed_date.toISOString();
    }

    savingGoalInfo.created_user_id = this.currentUserInfo.user_id;
    savingGoalInfo.modified_user_id = this.currentUserInfo.user_id;
    savingGoalInfo.goal_members = this.currentUserInfo.user_id;
    savingGoalInfo.enterprise_id = this.currentUserInfo.enterprise_id;

    console.log('savingGoalInfo');
    //this.globals.showLoading('Please wait');
    console.log(savingGoalInfo);
    console.log(this.goalInfo);

    if (this.modalType == 'create') {
      this.globals.showLoading('Please wait');
      this.enterpriseService.createGoal(JSON.stringify(savingGoalInfo)).subscribe(
        (result) => {
          this.globals.hideLoading('Please wait');
          console.log("POSTED GOAL SUCCESSFULLY");
          console.log(result);
          if (result.status == 200) {
            this.golasActivityData.goal_id = result.body.goal_id;
            this.golasActivityData.goal_action = "Goal Created."
            this.golasActivityData.enterprise_id = this.currentUserInfo.enterprise_id;
            this.golasActivityData.user_id = this.currentUserInfo.user_id;
            // this.sweetAlertDisplay("Goal created successfully", true);
            //this.eventT.emit('true');
           // this.bsModalRef.hide();
            this.createGoalsActivity();
            this.processMilestones(result.body.goal_id,this.currentUserInfo.enterprise_id);
          } else {

          }

          // this.createUserLog('Goal created successfully.',JSON.stringify(this.goalInfo));


        }, (err) => {
          this.globals.hideLoading('Please wait');
          this.globals.showErrorMessage('Something went wrong. Please try later!');
          console.log("POSTED GOAL FAILED");
          console.log(err);
        });
    } else {
      this.globals.showLoading('Please wait');
      this.enterpriseService.updateGoal(this.modalData.goal_id, JSON.stringify(savingGoalInfo)).subscribe(
        (result) => {
          this.globals.hideLoading('Please wait');
          console.log("UPDATED GOAL SUCCESSFULLY");
          console.log(result);
          if (result.status == 200) {
            this.golasActivityData.goal_id = this.modalData.goal_id;
            this.golasActivityData.goal_action = "Goal Updated."
            this.golasActivityData.enterprise_id = this.currentUserInfo.enterprise_id;
            this.golasActivityData.user_id = this.currentUserInfo.user_id;
            // this.sweetAlertDisplay("Goal updated successfully", true);
           // this.eventT.emit('true');
            //this.bsModalRef.hide();
            this.createGoalsActivity();
            this.processMilestones(this.modalData.goal_id,this.currentUserInfo.enterprise_id);
          } else {

          }
          // this.createUserLog('Goal created successfully.',JSON.stringify(this.goalInfo));

        }, (err) => {
          this.globals.hideLoading('Please wait');
          this.globals.showErrorMessage('Something went wrong. Please try later!');
          console.log("UPDATED GOAL FAILED");
          console.log(err);
        });

    }

  }

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

  createUserLog(activity, description) {
    this.userLogs.activity = activity;
    this.userLogs.description = description;
    this.userLogs.enterprise_id = this.globals.currentEnterpriseId;
    this.userLogs.user_id = this.globals.currentUserRoleId.toString();
    this.userService.createUserLog(this.userLogs).subscribe(
      (result) => {
        console.log('User Log Created');
        console.log(result);
      }, (err) => {
        console.log('user log creation error');
        console.log(err);
      });
  }

  getGoalLevels() {
    this.enterpriseService.getGoalLevels(this.globals.currentEnterpriseId).subscribe((result) => {
      if (result.status == 200) {
        console.log("Get Goal levels");
        console.log(result.body);
        let LevelCompareData = 'Enterprise';
        if (this.globals.currentUserRoleId == 2) {
          LevelCompareData = 'Enterprise';
        } else if (this.globals.currentUserRoleId == 3) {
          LevelCompareData = 'Team';
        } else if (this.globals.currentUserRoleId == 4) {
          LevelCompareData = 'Individual';
        } else { }
        for (let i = 0; i < result.body.length; i++) {
          if (result.body[i].level_name == LevelCompareData) {
            this.goalInfo.goal_level_id = result.body[i].level_id;
            console.log("Final Goal level : " + result.body[i].level_id);
          }
        }
      } else {
        console.log("Get Goal levels status API status : " + result.status);
      }

    }, (err) => {
      console.log("Get Goal levels status API Error : ");
      console.log(err);
    });
  }

  getGoalTypes() {
    this.enterpriseService.getGoalTypes(this.globals.currentEnterpriseId).subscribe((result) => {
      if (result.status == 200) {
        console.log("Get Goal Types");
        console.log(result.body);
        this.goal_Types = result.body;
        console.log(this.globals.currentUserRoleId);
        let LevelCompareData = 'Professional';
        if (this.globals.currentUserRoleId == 1) {
          LevelCompareData = 'Professional';
          this.show_category = false;
          for(let i=0;i<this.modalCategories.length;i++){
            if(this.modalCategories[i].name == "Miscellaneous" && (this.modalType == 'create')){
              this.goalInfo.goal_category_id = this.modalCategories[i].category_id;
            }
          }

        } else if (this.globals.currentUserRoleId == 2) {
          LevelCompareData = 'Professional';
          this.show_category = false;
          for(let i=0;i<this.modalCategories.length;i++){
            console.log("modal...carogeries");
            if(this.modalCategories[i].name == "Miscellaneous" && (this.modalType == 'create')){
              this.goalInfo.goal_category_id = this.modalCategories[i].category_id;
            }
          }
        } else if (this.globals.currentUserRoleId == 3) {
          LevelCompareData = 'Personal';
          this.show_category = false;
          for(let i=0;i<this.modalCategories.length;i++){
            console.log("modal...carogeries");
            if(this.modalCategories[i].name == "Miscellaneous" && (this.modalType == 'create')){
              this.goalInfo.goal_category_id = this.modalCategories[i].category_id;
            }
          }
        } else if (this.globals.currentUserRoleId == 4) {
          LevelCompareData = 'Personal';
          // let check_valid = false;
          console.log(this.modalData.created_user_id);
          console.log(this.globals.currentUserId);
          if((this.modalData.created_user_id == this.globals.currentUserId) || (this.modalType == 'create') ){
            this.show_category = true;
          } else{
            this.show_category = false;
          }
          

          for(let i=0;i<this.modalCategories.length;i++){
            console.log("modal...carogeries");
            if(this.modalCategories[i].name == "Miscellaneous" && (this.modalType == 'create')){
              this.goalInfo.goal_category_id = this.modalCategories[i].category_id;
               }
          }
        } else { }
        for (let i = 0; i < result.body.length; i++) {
          if (result.body[i].type_name == LevelCompareData) {
            //this.goalInfo.goal_type_id = result.body[i].goal_type_id;
            if(this.modalType == 'create'){
              this.goalInfo.goal_type_id = result.body[0].goal_type_id ? result.body[0].goal_type_id : "";
            }
            console.log("Final Goal Type ID : " + result.body[i].goal_type_id);
          }
        }
      } else {
        console.log("Get Goal Types status API status : " + result.status);
      }

      console.log('------------ Goal type id:' + this.goalInfo.goal_type_id);

    }, (err) => {
      console.log("Get Goal Types status API Error : ");
      console.log(err);
    });
  }

  createMilestones(inputData) {

    this.enterpriseService.createMilestones(inputData).subscribe((result) => {
      if (result.status == 200) {
        console.log("Create Milestones ");
        console.log(result.body);
        this.eventT.emit('true');
        
      } else {
        console.log("Create Milestones status API status : " + result.status);
      }
    }, (err) => {
      console.log("Create Milestones status API Error : ");
      console.log(err);
    });

  }

  createGoalsActivity() {

    this.enterpriseService.createGoalsActivity(this.golasActivityData).subscribe((result) => {
      if (result.status == 200) {
        console.log("Create Goals Activity ");
        console.log(result.body);
       console.log("olaaa",this.milestonesNumberCount )
       if(this.milestonesNumberCount.length == 0){
         this.eventT.emit('true')
         this.bsModalRef.hide();
       }
      } else {
        console.log("Create Goals Activity status API status : " + result.status);
      }
    }, (err) => {
      this.bsModalRef.hide();
      console.log("Create Goals Activity status API Error : ");
      console.log(err);
    });

  }


  getmileStones() {
    // milestonesData
    this.enterpriseService.getMilestones(this.globals.currentEnterpriseId, this.modalData.goal_id).subscribe((result) => {
      if (result.status == 200) {
        console.log("Get Milestones ");
        console.log(result.body);

        let receivedData = result.body;
        receivedData.sort(function (a, b) {
          return a.milestone_number - b.milestone_number;
        });
        for (let i = 0; i < receivedData.length; i++) {
          if(receivedData[i].completion_date == '1900-01-01T00:00:00.000Z'){
            receivedData[i].completion_date = "";
          }else{
            receivedData[i].completion_date = new Date(receivedData[i].completion_date);
          }
          if(receivedData[i].target_date == '1900-01-01T00:00:00.000Z'){
            receivedData[i].target_date = "";
          }else{
            receivedData[i].target_date = new Date(receivedData[i].target_date);
          }
          this.milestonesData[i] = receivedData[i];
          this.milestoneIdData[i].milestone_id = receivedData[i].milestone_id;
          this.milestonesNumberCount.push(result.body[i].milestone_number);
        }



        console.log(this.milestonesData);

      } else {
        console.log("Get Milestoness API status : " + result.status);
      }
    }, (err) => {
      console.log("Get Milestones API Error : ");
      console.log(err);
    });

  }


  processMilestones(goalID, enterpriseID) {
    console.log("@@@@@@@@@@@@@@");
    console.log(this.milestonesData);
    console.log(goalID);
    console.log(enterpriseID);

    for (let i = 0; i < 4; i++) {
      console.log(this.milestonesNumberCount);
      console.log(this.milestonesNumberCount.includes(this.milestonesData[i].milestone_number.toString()));

      if (this.milestonesNumberCount.includes(this.milestonesData[i].milestone_number.toString())) {
        if (this.milestonesData[i].milestone == "" && this.milestonesData[i].target_date == "") {
          //Do Nothing
        } else {
          // this.milestonesData[i].target_date = this.datepipe.transform(this.milestonesData[i].target_date, 'yyyy-MM-dd hh:mm:ss');
          // this.milestonesData[i].completion_date = this.datepipe.transform(this.milestonesData[i].completion_date, 'yyyy-MM-dd hh:mm:ss');
          this.milestonesData[i].target_date = this.milestonesData[i].target_date?this.milestonesData[i].target_date.toISOString():'';
          this.milestonesData[i].completion_date = this.milestonesData[i].completion_date ?  this.milestonesData[i].completion_date.toISOString() : "";

          this.enterpriseService.updateMilestones(this.milestonesData[i].milestone_number, this.milestonesData[i]).subscribe((result) => {
            console.log(result);
            if (result.status == 200) {
              console.log("Updated Milestone " + i + " Sucessfully");
              this.milestoneActivityData.milestone_id =   this.milestoneIdData[i].milestone_id;
              this.milestoneActivityData.milestone_action = "Updated Milestone"
              this.milestoneActivityData.enterprise_id = this.currentUserInfo.enterprise_id;
              this.milestoneActivityData.user_id = this.currentUserInfo.user_id;
              this.milestoneActivityData.goal_id = goalID;

              console.log("Milestone Activity Sent data : ");
              console.log(this.milestoneActivityData);
              this.createMilestoneActivity(this.milestoneActivityData,"Updated");
            }
          }, (err) => {
            console.log("Milestone update err");
            console.log(err);
          });
        }
      } else {
        console.log("ENtered Else Block");
        console.log(this.milestonesData);
        console.log(this.milestonesData[i]);
        console.log(i);
        if (this.milestonesData[i].milestone == "" && this.milestonesData[i].target_date == "" && this.milestonesData[i].completion_date == "") {
          //Do Nothing
          console.log("ENtered Here");
        } else {
          console.log("Create Milestone....");
          this.milestonesNumberCount.push(i + 1);
          this.milestonesData[i].goal_id = goalID;
          this.milestonesData[i].milestone_number = i + 1;
          this.milestonesData[i].enterprise_id = parseInt(enterpriseID);
          // this.milestonesData[i].target_date = this.datepipe.transform(this.milestonesData[i].target_date, 'yyyy-MM-dd hh:mm:ss');
          // this.milestonesData[i].completion_date = this.datepipe.transform(this.milestonesData[i].completion_date, 'yyyy-MM-dd hh:mm:ss');
          this.milestonesData[i].target_date = this.milestonesData[i].target_date?this.milestonesData[i].target_date.toISOString():"";
          this.milestonesData[i].completion_date = this.milestonesData[i].completion_date ?  this.milestonesData[i].completion_date.toISOString() :"";
          this.enterpriseService.createMilestones(this.milestonesData[i]).subscribe((result) => {
            console.log("milestone response");
            console.log(result);
            if (result.status == 200) {
              console.log("Created Milestone " + i + " Sucessfully");
              this.milestoneActivityData.milestone_id = result.body.milestone_id;
              this.milestoneActivityData.milestone_action = "Created Milestone"
              this.milestoneActivityData.enterprise_id = this.currentUserInfo.enterprise_id;
              this.milestoneActivityData.user_id = this.currentUserInfo.user_id;
              this.milestoneActivityData.goal_id = goalID;

              console.log("Milestone Activity Sent data : ");
              console.log(this.milestoneActivityData);
              this.createMilestoneActivity(this.milestoneActivityData,"Created");
            }
          }, (err) => {
            console.log("Milestone creation err");
            console.log(err);
          });
        }
      }
    }
  }


  createMilestoneActivity(inputData,status){
    this.enterpriseService.createMilestoneActivity(inputData).subscribe((result) => {
      if(result.status == 200){
        console.log("Milestone Activity "+ status +" successfully");

        this.eventT.emit('true');
        this.bsModalRef.hide();

      }else{
        this.bsModalRef.hide();
        console.log("Milestone Activity api error with status "+ result.status);
      }

    },(err)=>{

      console.log("Milestone Activity api error ");
      console.log(err);
    });
  }



  // trigger(input,field){
  //   console.log("Triggered.... field" + field);
  //   console.log(input);
  //   if(field == 's'){
  //     this.scheduledMinDate = new Date(input);
  //     if((new Date(input) > new Date(this.goalInfo.target_date)) && this.goalInfo.target_date){
  //       this.goalInfo.target_date = new Date(input);
  //       this.targetMinDate = new Date(input);
  //       // this.triggerMilestonesData();
  //     }
  //     if((new Date(input) > new Date(this.goalInfo.completed_date)) && this.goalInfo.completed_date){
  //       this.goalInfo.completed_date = new Date(input);
  //       this.completedMinDate = new Date(input);
  //     }

  //   } else if(field == 't'){
  //     this.targetMinDate = new Date(input);
  //     // this.triggerMilestonesData();
  //     if((new Date(input) > new Date(this.goalInfo.completed_date)) && this.goalInfo.completed_date){
  //       this.goalInfo.completed_date = new Date(input);
  //       this.completedMinDate = new Date(input);
  //     }

  //   } else{
  //     this.completedMinDate = new Date(input);
  //   }
  // }

  // triggerMilestonesData(){
  //   for(let i=0;i<4;i++){
  //     if(this.milestonesData[i].target_date != ""){
  //       this.milestonesData[i].target_date = (new Date(this.goalInfo.target_date) > new Date(this.milestonesData[i].target_date)) ? this.goalInfo.target_date : this.milestonesData[i].target_date;
  //     }
  //     if(this.milestonesData[i].completion_date != ""){
  //       this.milestonesData[i].completion_date = (new Date(this.goalInfo.target_date) > new Date(this.milestonesData[i].completion_date)) ? this.goalInfo.target_date : this.milestonesData[i].completion_date;
  //     }

  //   }
  // }


  onGoalTypeChange(event){
    console.log("Goal type changed..");
    console.log(event);
    //console.log(event.target.value);
    this.goalInfo.goal_type_id = event;
  }

}

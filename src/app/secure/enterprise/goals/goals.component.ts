import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GoalsCreateComponent } from './goals-create/goals-create.component';
import swal from 'sweetalert2';
import { GoalsActivityComponent } from './goals-activity/goals-activity.component';
import { UserService, EnterpriseService, AuthenticationService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { GlobalService } from 'src/app/global/app.global.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { EventBrokerModule, EventBrokerService } from 'ng-event-broker';
import { Help } from 'src/app/events.model';
import * as _ from 'lodash';
// import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})

export class GoalsComponent implements OnInit {
  // myDateValue: Date;
  filterBy: string = 'goal_title';
  filterBySort: string = 'goal_title,asc';

  modalRef: BsModalRef;
  allGoals: any[] = [];
  enterpiseGoals:any[] = []
  teamGoals:any[] = []
  individualGoals:any[] = []
  modalType: string = 'create';

  allCatogeries : any[] = [];
  miscellaneousCatogeryID = null;

  displayStyle = 'grid';
  pageSize: number = 10;
  currentPage = 1;
  direction: number;
	isDesc: boolean = false;
  column: string = 'goal_title';
  searchBy: any;
  searchBy_duplicate ='';
  sortDirection: string = 'asc';
	page: number;
  totalItems:number = 0;
  public eventT: EventEmitter<any> = new EventEmitter();
  /*name of the excel-file which will be downloaded. */
  fileName= 'ExcelSheet.xlsx';
  dataLength: number;
  taData: any[] = [];
  finalExportData: any[] = [];
  targetMinDate = new Date();
  user_id = '';
  filter_by_level = false;
  goal_level_selection = ""
  filter_goal_level = 1;

  goalLevels = [];
  constructor(private modalService: BsModalService, private enterpriseService:EnterpriseService, private globals:GlobalService, private datepipe: DatePipe, private eventService: EventBrokerService) {
    // this.user_id = localStorage.getItem('currentUser.user.user_id');
    this.user_id = this.globals.currentUserId;
    console.log("Current user id : "+ this.globals.currentUserId);


    // var localGoallevels = localStorage.getItem('GoalLevels');
    // if(localGoallevels != undefined && localGoallevels != null && localGoallevels != ''){
    //   this.goalLevels = JSON.parse(localGoallevels);
    //   console.log("this.goalLevels",this.goalLevels);
    // }else{
      this.getGoalLevels();
    //}

    this.getCategories();
   
    // this.pageSize = this.globals.pageSize;
    this.searchBy = this.getSearchObject();

  }
  searchText: string = '';

  // ngOnDestroy(): void {
	// 	this.eventService.clearEvents()
	// }

  ngOnInit() {
   // this.eventService.subscribeEvent(Help.CompassHelp).subscribe(() => alert('Goalshelp'));
  }

  openDeleteAccessConfirm(){
    console.log("Popup you do not have access to delete.");
    this.sweetAlertDisplay("You are not authorized to delete this goal.", false,'NoAccess');
  }

  getCategories(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getCategories(this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (result) => {
        console.log(result.body);
          if (result.status == Constants.HTTP_STATUS_OK) {
           // this.allCatogeriesActions['color'] = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," +
            // Math.floor(Math.random() * 255) + ")";
            console.log("Get all catogeries....");
            console.log(result.body);
            this.allCatogeries = result.body;
            for(let i=0;i<this.allCatogeries.length;i++){
              if(this.allCatogeries[i].name == "Miscellaneous"){
                this.miscellaneousCatogeryID = this.allCatogeries[i].category_id;
              }
            }
          }else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
            this.globals.hideLoading('Please wait');

          }else {
            this.globals.hideLoading('Please wait');
          }

      },(err)=>{
        this.globals.hideLoading('Please wait');

      }
      );

  }

  exportExcel() {
        this.dataLength =  this.totalItems;
        var loadDataCount = (this.dataLength < 1000) ? this.dataLength : 1000;
              for (var i = 0; i <= this.dataLength/ 1000; i++) {
                  this.enterpriseService.getAllGoals(this.globals.currentEnterpriseId,i+1,loadDataCount,this.column,this.sortDirection,this.globals.currentUserId).subscribe(
                    (result) => {
                        if (result.status == Constants.HTTP_STATUS_OK) {
                          var origin = this.taData.concat(result.body);
                          var old = JSON.stringify(origin).replace(/null/g, '""');
                          this.taData = JSON.parse(old);
                          this.finalExportData = [];

                          for (var i = 0; i < this.taData.length; i++) {
                                this.taData[i]["exportData"] = {};
                                var json = this.taData[i]["exportData"];

                                json["Goal Title "] = this.taData[i].goal_title;
                                  let yourDate = new Date(this.taData[i].target_date);
                                  yourDate.toString();
                                json["Target Date"] = yourDate;
                                json["Description"] = this.taData[i].description;
                                json["Milestones"]  = this.taData[i].milestone_count;

                              if (this.searchText != '') {
                                  if (this.filterBy == 'goal_title') {
                                      if (this.taData[i].goal_title.toUpperCase().search(this.searchText.toUpperCase()) != -1) {
                                          this.finalExportData.push(json);
                                      }
                                  } else if (this.filterBy == 'target_date') {
                                      if (this.taData[i].target_date.toUpperCase().search(this.searchText.toUpperCase()) != -1) {
                                        this.finalExportData.push(json);
                                      }
                                  } else if (this.filterBy == 'description') {
                                      if (this.taData[i].description.toUpperCase().search(this.searchText.toUpperCase()) != -1) {
                                        this.finalExportData.push(json);
                                      }
                                  } else if (this.filterBy == 'milestone_count') {
                                      if (this.taData[i].milestone_count.toString().search(this.searchText.toString()) != -1) {
                                        this.finalExportData.push(json);
                                     }
                                  }  else{
                                      this.finalExportData.push(json);
                                  }
                              } else {
                                this.finalExportData.push(json);
                              }
                          }

                          this.taData = [];

                            const wb: XLSX.WorkBook = XLSX.utils.book_new();
                            const workSheet = XLSX.utils.json_to_sheet(this.finalExportData);
                            const workBook: XLSX.WorkBook = XLSX.utils.book_new();

                            var wscols = [
                              { wch: 20 },
                              { wch: 10 },
                              { wch: 20 },
                              { wch: 5 }
                            ];

                            workSheet["!cols"] = wscols;
                            workSheet["!rows"]

                            XLSX.utils.book_append_sheet(workBook, workSheet, 'Goals');
                            XLSX.writeFile(workBook, 'Goals.xlsx');
                        }
                 });

              }

  }

  getAllGoalsMethod(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getAllGoals(this.globals.currentEnterpriseId,this.currentPage, this.pageSize,this.column,this.sortDirection,this.globals.currentUserId).subscribe(
      (result) => {
          this.globals.hideLoading('Please wait');
          if (result.status == Constants.HTTP_STATUS_OK) {
            this.allGoals = _.orderBy(result.body, ['target_date'],['asc']);
            if(this.goalLevels[0].level_name == 'Enterprise'){
              this.enterpiseGoals = _.orderBy(result.body.filter(x=>x.goal_level_id == this.goalLevels[0].level_id),['target_date'],['asc'])
            }
            if(this.goalLevels[1].level_name == 'Team'){
              this.teamGoals = _.orderBy(result.body.filter(x=>x.goal_level_id == this.goalLevels[1].level_id),['target_date'],['asc'])
            }
            if(this.goalLevels[2].level_name == 'Individual'){
              this.individualGoals = _.orderBy(result.body.filter(x=>x.goal_level_id == this.goalLevels[2].level_id),['target_date'],['asc'])
            }

            console.log("this.enterpiseGoals",this.enterpiseGoals)
            console.log("this.individualGoals",this.individualGoals)
            console.log("this.teamGoals",this.teamGoals)
            console.log(result.body);
            this.totalItems = parseInt(result.headers.get('x-total-rows'));
            if(result.body == null){
              this.allGoals = [];
            }
          }else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
            this.allGoals = [];
            this.totalItems = 0;
          } else {
            this.allGoals = [];
            this.totalItems = 0;
          }
          console.log(this.allGoals.length);

      },(err)=>{
        this.globals.hideLoading('Please wait');
        console.log("[FAILURE]Loaded All Goals");
        console.log(err);
        this.allGoals = [];
        this.totalItems = 0;
      }
      );

  }

  getAllGoalsMethod_with_filter(){
    console.log("Goals method.....filter data called.");
    this.globals.showLoading('Please wait');
    this.enterpriseService.filterGoalData(this.globals.currentEnterpriseId,this.currentPage, this.pageSize,this.column,this.sortDirection,this.globals.currentUserId,this.filterBy,this.searchBy_duplicate).subscribe(
      (result) => {
          this.globals.hideLoading('Please wait');
          if (result.status == Constants.HTTP_STATUS_OK) {
            this.allGoals = result.body;
            console.log(result.body);
            this.totalItems = parseInt(result.headers.get('x-total-rows'));
            if(result.body == null){
              this.allGoals = [];
            }
          }else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
            this.allGoals = [];
            this.totalItems = 0;
          } else {
            this.allGoals = [];
            this.totalItems = 0;
          }
          console.log(this.allGoals.length);

      },(err)=>{
        this.globals.hideLoading('Please wait');
        console.log("[FAILURE]Loaded All Goals");
        console.log(err);
        this.allGoals = [];
        this.totalItems = 0;
      }
      );
  }

  sortBykey(key) {
      this.direction = this.isDesc ? 1 : -1;
      this.isDesc = !this.isDesc;
      this.column = key;

      if(this.direction == 1){
        this.sortDirection = 'asc';
      }else{
        this.sortDirection = 'desc';
      }

      this.filterBySort = this.column+","+this.sortDirection;
      console.log(this.filterBySort);

      // Cal API Here
      console.log(this.column);
      console.log(this.sortDirection);
      this.getAllGoalsMethod();
  }

  gridSort(){
      console.log(this.filterBySort);

      var nameArr = this.filterBySort.split(',');
      this.column =  nameArr[0];
      this.sortDirection = nameArr[1];

      console.log(this.column);
      console.log(this.sortDirection);
      this.getAllGoalsMethod();
  }

  //Date Range filter function
  startdate; '';
  enddate = '';
  changeDate(data) {
    if(data!=null){
      console.log(data);
      this.startdate = this.datepipe.transform(data[0], 'yyyy-MM-dd');
      console.log(this.startdate);
      this.enddate = this.datepipe.transform(data[1], 'yyyy-MM-dd');
      console.log(this.enddate);
      this.searchBy_duplicate = this.startdate + ','+this.enddate;
      console.log(this.searchBy_duplicate);
    }else{
      this.searchBy_duplicate ='';
    }


    //this.searchBy = this.getSearchObject();
  }

  getSearchObject() {
    let searchObj = {};
		if (this.filterBy == '') {
			searchObj['goal_title'] = this.searchText;
      searchObj['target_date'] = this.searchText;
      searchObj['description'] = this.searchText;
      searchObj['milestone_count'] = this.searchText;
      searchObj['goal_level_id'] = this.searchText;
		} else if (this.filterBy == 'goal_title') {
       searchObj['goal_title'] = this.searchText;
		} else if (this.filterBy == 'goal_level_id') {
      searchObj['goal_level_id'] = this.searchText;
   } else if (this.filterBy == 'target_date') {
       searchObj['target_date'] = this.searchText;
		}else if (this.filterBy == 'milestone_count') {
       searchObj['milestone_count'] = this.searchText;
		}else if (this.filterBy == 'description') {
       searchObj['description'] = this.searchText;
		}
    return searchObj;
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.currentPage = event.page;

    this.getAllGoalsMethod();
	}

  refreshPageData() {
    /* Page refresh method will be called here */
    this.filterBy = 'goal_title';
    this.filterBySort= 'goal_title,asc';
    this.searchBy_duplicate = '';
    this.searchText = '';
    this.getAllGoalsMethod();
  }

  refreshSearch() {
    this.searchBy = this.getSearchObject();
    console.log(this.searchBy);
    this.filter_by_level = false;
    this.searchBy_duplicate = '';
    this.searchText = '';
    this.goal_level_selection = '';
    this.getAllGoalsMethod_with_filter();
  }

  selectGoalLevel(){
    this.searchText = this.goal_level_selection;
    this.searchBy_duplicate = this.searchText ? this.searchText : '';
    console.log("Selection Changed...");
    console.log("this.searchText");
    this.getAllGoalsMethod_with_filter();
  }

  triggerForEmpty(){
    console.log("Keyup triggred");
    this.searchBy_duplicate = this.searchText ? this.searchText : '';
    if(this.searchBy_duplicate == ''){
      console.log("search string is empty");
      this.getAllGoalsMethod_with_filter();
    }
  }

  getSearchDetailsFromServer() {
    console.log("Search details from server");
    console.log(this.searchText);
    console.log(this.filterBy);

      this.getAllGoalsMethod_with_filter();

  }

  openGoalsModal(type,data) {
    const initialState = {
      modalType: type,
      modalData: data,
      modalCategories:this.allCatogeries
    };
    this.modalRef = this.modalService.show(GoalsCreateComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));


    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        console.log("tererererere@@@")
        /* Goals loading method should be called here */
        this.getAllGoalsMethod();
      }
    });
  }

  openActivity(data) {
    const initialState = {
      modalType: this.modalType,
      modalData : data
    };
    this.modalRef = this.modalService.show(GoalsActivityComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));
    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        /* Goals loading method should be called here */
        this.getAllGoalsMethod();
      }
    });
  }

  openDeleteConfirmDialog(goal) {
    console.log("GOALLLLLLLL");
    console.log(goal);
    swal.fire({
      html: '<span style="font-size:large;">Are you sure to delete the goal </span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      imageUrl: 'assets/img/Question-48.png',
      iconHtml: '<img src="assets/img/Question-48.png" style="width:45px; height:45px;"/>',
      allowOutsideClick: false,
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      allowEscapeKey: false
    }).then((result) => {
      if (result.value) {
        console.log("Goal Delete command fired...");
        console.log(goal.enterprise_id);
        console.log(goal.goal_id);
        this.globals.showLoading('Please wait');
        this.enterpriseService.deleteGoal(goal.enterprise_id,goal.goal_id).subscribe(
          (result) => {
            this.globals.hideLoading('Please wait');
            if(result.status == 200){
              console.log(result);
             
              this.getAllGoalsMethod();
            }else{
              console.log("Delete Api server error.");
              this.sweetAlertDisplay("Goal Deleted failed", false,'');
            }

          },(err)=>{
            this.globals.hideLoading('Please wait');
            console.log("Goal delete Error");
            this.globals.showErrorMessage('Something went wrong. Please try later!');
          });
      }
    }, (error)=>{
      console.log("Goal has not been Deleted.");

    })
  }

  setStyle(type) {

    this.displayStyle = type;
    console.log(this.displayStyle);
    console.log(this.filterBySort);

  }

  sweetAlertDisplay(title, status,type) {

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

          this.getAllGoalsMethod();
          // this.eventT.emit('true');
          // this.bsModalRef.hide();
        }
      });
    } else {

      if(type == 'NoAccess'){
        swal.fire({
          title: title,
          html: '',
          allowEscapeKey: false,
          showCloseButton: false,
          imageUrl: 'assets/img/Cancel-48.png',
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
      }else{
        swal.fire({
          title: title,
          html: '<span style="font-size:medium; color: #0072bb;">Something went wrong!! Try Again</span>',
          allowEscapeKey: false,
          showCloseButton: false,
          imageUrl: 'assets/img/Cancel-48.png',
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


  getGoalLevels() {
    this.enterpriseService.getGoalLevels(this.globals.currentEnterpriseId).subscribe((result) => {
      if (result.status == 200) {
        this.goalLevels = result.body;
        console.log("this.goalLevels",this.goalLevels)
        this.getAllGoalsMethod();
        localStorage.setItem('GoalLevels', JSON.stringify(this.goalLevels));
      } else {
        console.log("Get Goal levels status API status : " + result.status);
      }
    }, (err) => {
      console.log("Get Goal levels status API Error : ");
      console.log(err);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TeamCreateComponent } from './team-create/team-create.component';
import { UserService, EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { GlobalService } from 'src/app/global/app.global.service';
import { AuthenticationService } from 'src/app/services';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  filterBy: string = "";
  modalRef: BsModalRef;
  allTeamManagers:any = [];
  allTeamMembers:any=[];
  allUsers:any=[];
  allTeams:any=[];
  searchText: string;
  modalType: string = 'NEW';
  selectedTeamInfo:any;
	direction: number;
	isDesc: boolean = false;
  column: string;
  searchBy: any;
  sortDirection: string = 'asc';
  currentPage = 1;
	page: number;
  pageSize: number;
  totalItems: number = 0;
  userLogs: UserLog = new UserLog();


  constructor(private enterpriseService: EnterpriseService, private globals:GlobalService, private modalService: BsModalService, private userService: UserService, private authenticationService:AuthenticationService) {

    this.loadTeams();
    this.getTeamManagers();
    this.getTeamMemebers();
    this.pageSize = this.globals.pageSize;
    this.searchBy = this.getSearchObject();
   }

  ngOnInit() {
  }



  createTeam(){
    this.modalType = 'NEW';
    this.selectedTeamInfo = null;
    this.openIndividualModal();
  }

  editTeam(user){
    this.modalType = 'EDIT';
    this.selectedTeamInfo = user;
    this.openIndividualModal();
  }


  openDeleteConfirmDialog(user){
    console.log('Selected User for Delete');
    console.log(user);
    swal.fire({
      html:'<span style="font-size:large;">Are you sure to delete </span> <span style="font-size:large; color:red; font-weight:bold;"> ' + user.name + ' ?</span>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      imageUrl:'assets/img/Question-48.png',
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
        this.sendDeleteTeamRequestToServer(user.team_id);
      }
    })
  }

  openIndividualModal(){
    const initialState = {
      modalType: this.modalType,
      individualData: this.selectedTeamInfo,
      teamMembers: this.allTeamMembers,
      teamManagers: this.allTeamManagers,
      teams:this.allTeams
    };
    this.modalRef = this.modalService.show(TeamCreateComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));


    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if(data == 'true'){
          this.loadTeams();
      }
    });
  }


  sortBykey(key) {
		this.direction = this.isDesc ? 1 : -1;
		this.isDesc = !this.isDesc;
    this.column = key;

  }

  refreshSearch() {
		this.searchBy = this.getSearchObject();
	}

  getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			searchObj['name'] = this.searchText;
      searchObj['email'] = this.searchText;
		} else if (this.filterBy == 'name') {
			searchObj['name'] = this.searchText;
		} else if (this.filterBy == 'email') {
			searchObj['email'] = this.searchText;
		}
    return searchObj;
  }


  pageChanged(event: any): void {
		this.page = event.page;
	}

loadTeams(){
  this.globals.showLoading('Please wait');
  this.enterpriseService.getAllTeams(this.globals.currentEnterpriseId).subscribe(
    (result) => {
        this.globals.hideLoading('Please wait');
        console.log("[Success]Loaded All Teams");
        console.log(result.body);
        this.allTeams = result.body;
        if(result.body == null){
          this.allTeams = [];
        }
        this.totalItems = this.allTeams.length;
    },(err)=>{
      this.globals.hideLoading('Please wait');
      console.log("[FAILURE]Loaded All Teams");
      console.log(err);
      this.allTeams = [];
      this.totalItems = 0;

    });
}


getTeamManagers(){

  this.enterpriseService.getTeamManagers(this.globals.currentEnterpriseId).subscribe(
    (result) => {
      console.log("[Success]Loaded All Team Managers");
      console.log(result.body);
      if (result.status == Constants.HTTP_STATUS_OK) {
        this.allTeamManagers = result.body;
      } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
        this.allTeamManagers = [];
      } else {
        this.allTeamManagers = [];
      }
    },
    (error) => {
      console.log("[Failure]Loaded All Team Managers");
      console.log(error);
      this.allTeamManagers = [];
      console.log('Error Block');
      console.log(error);
    }
  );

}


getTeamMemebers(){

  this.enterpriseService.getTeamMembers(this.globals.currentEnterpriseId).subscribe(
    (result) => {
      console.log("[Success]Loaded All Team Members");
      console.log(result.body);
      if (result.status == Constants.HTTP_STATUS_OK) {
        this.allTeamMembers = result.body;
      } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
        this.allTeamMembers = [];
      } else {
        this.allTeamMembers = [];
      }
    },
    (error) => {
      console.log("[Failure]Loaded All Team Members");
      console.log(error);
      this.allTeamMembers = [];
      console.log('Error Block');
      console.log(error);
    }
  );

}



  refreshPageData(){
    this.loadTeams();
  }

  sendDeleteTeamRequestToServer(teamID){
    this.globals.showLoading('Please wait');
    this.enterpriseService.deleteTeam(teamID).subscribe(
      (result) => {

        console.log("TEAM DELETED SUCCESSFULLY");
        console.log(result);
       // this.showMessageAndLoadValues('Team deleted successfully.');
        this.createUserLog('Team deleted successfully.',teamID);
        this.loadTeams();


      },(err)=>{
        this.globals.showErrorMessage('Something went wrong!. Please try later!');
        console.log("TEAM DELETED FAILED");
        console.log(err);
      });
  }


  showMessageAndLoadValues(title){
    swal.fire({
      title: title,
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
        this.loadTeams();
      }
  });
}

createUserLog(activity, description){
  console.log(activity);
  console.log(description);

  this.userLogs.activity = activity;
  this.userLogs.description = description;
  this.userLogs.enterprise_id = this.globals.currentEnterpriseId;
  this.userLogs.user_id = this.globals.currentUserRoleId.toString();
  this.userService.createUserLog(this.userLogs).subscribe(
    (result) => {
        console.log('User Log Created');
        console.log(result);
    },(err)=>{
      console.log('user log creation error');
      console.log(err);
    });
}

}

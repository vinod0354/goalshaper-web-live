import { Component, OnInit, PipeTransform } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IndividualCreateComponent } from './individual-create/individual-create.component';
import { UserService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { GlobalService } from 'src/app/global/app.global.service';
import { AuthenticationService } from 'src/app/services';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';


@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {

  allIndividuals:any = [];
  allUserRoles: any = []
  modalRef: BsModalRef;
  allUsers:any = [];
  currentPage = 1;
	page: number;
  pageSize: number = 10;
  totalItems: number = 0;
	searchText: string;
	searchBy: any;
	searchFields: {
		code: string;
	};
	filterBy: string = '';

	direction: number = 1;
  isDesc: boolean = false;
  sortDirection: string = 'asc';
  column: string = 'firstname';
  selectedUserInfo:any = null;
  modalType: string = 'NEW';
  userLogs: UserLog = new UserLog();

  constructor(private globals:GlobalService, private modalService: BsModalService, private userService: UserService) {
    this.loadUsers();
    this.loadUserRoles();
    this.loadallUsersWithLessInfo();
    this.pageSize = this.globals.pageSize;
    this.searchBy = this.getSearchObject();
  }

  ngOnInit() {
  }

  refreshPageData(){
    this.loadUsers();
  }

  refreshSearch() {
		this.searchBy = this.getSearchObject();
	}

  getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			//searchObj['user_name'] = this.searchText;
			searchObj['firstname'] = this.searchText;
			searchObj['lastname'] = this.searchText;
      searchObj['email'] = this.searchText;
      searchObj['role_name'] = this.searchText;
      searchObj['designation'] = this.searchText;
      // searchObj['employee_id'] = this.searchText;
      searchObj['phone_number'] = this.searchText;
		} else if (this.filterBy == 'user_name') {
			searchObj['user_name'] = this.searchText;
		} else if (this.filterBy == 'firstname') {
			searchObj['firstname'] = this.searchText;
		} else if (this.filterBy == 'lastname') {
			searchObj['lastname'] = this.searchText;
		} else if (this.filterBy == 'email') {
			searchObj['email'] = this.searchText;
		} else if (this.filterBy == 'role_name') {
			searchObj['role_name'] = this.searchText;
		} else if (this.filterBy == 'designation') {
			searchObj['designation'] = this.searchText;
		// } else if (this.filterBy == 'employee_id') {
		// 	searchObj['employee_id'] = this.searchText;
		} else if (this.filterBy == 'phone_number') {
			searchObj['phone_number'] = this.searchText;
		}
		return searchObj;
	}

  loadallUsersWithLessInfo(){
    console.log('Ids to Send:' + this.globals.currentEnterpriseId+','+this.globals.currentUserRoleId);
    this.userService.getallUsers(this.globals.currentEnterpriseId, this.globals.currentUserRoleId ).subscribe(
      (result) => {
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.allUsers = result.body;
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.allUsers = [];
        } else {
          this.allUsers = [];
        }
      },
      (error) => {
        this.allUsers = [];
        console.log('Error Block');
        console.log(error);
      }
    );
  }

  loadUsers(){
    this.globals.showLoading('Please wait');
    console.log('Ids to Send:' + this.globals.currentEnterpriseId+','+this.globals.currentUserRoleId);
    this.userService.getUsers(this.globals.currentEnterpriseId, this.globals.currentUserRoleId, this.currentPage, this.pageSize, this.column, this.sortDirection).subscribe(
      (result) => {
        this.globals.hideLoading('Please wait');
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.allIndividuals = result.body;
          this.totalItems = parseInt(result.headers.get('x-total-rows'));
          // var enterpriseAdminIndex = this.allIndividuals.findIndex(x => x.role_id== "2");
          // console.log('Enterprise Admin Index:' + enterpriseAdminIndex);
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.allIndividuals = [];
          this.totalItems = 0;
        } else {
          this.allIndividuals = [];
          this.totalItems = 0;
        }
      },
      (error) => {
        this.globals.hideLoading('Please wait');
        this.allIndividuals = [];
        this.totalItems = 0;
        console.log('Error Block');
        console.log(error);
      }
    );
  }

  loadUserRoles(){
    this.userService.getUserRoles().subscribe(
      (result) => {
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.allUserRoles = result.body;
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.allUserRoles = [];
        } else {
          this.allUserRoles = [];
        }
      },
      (error) => {
        this.allUserRoles = [];
        console.log('Error Block');
        console.log(error);
      }
    );
  }

  searchResults(text: string, pipe: PipeTransform): any[] {
		return this.allUserRoles.filter((users) => {
			const term = text.toLowerCase();
			return (
				users.user_name.toLowerCase().includes(term) ||
				pipe.transform(users.firstname).includes(term) ||
				pipe.transform(users.lastname).includes(term)
			);
		});
	}

	pageChanged(event: any): void {
    this.currentPage = event.page;
    this.page = event.page;

    this.loadUsers();
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
    this.loadUsers();
	}


  openIndividualModal(){
    const initialState = {
      individualRoles: this.allUserRoles,
      modalType: this.modalType,
      individualData: this.selectedUserInfo,
      allUsers: this.allUsers
    };
    this.modalRef = this.modalService.show(IndividualCreateComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));


    this.modalRef.content.event.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if(data == 'true'){
        this.loadUsers();
      }
    });


  }


  createUser(){
    this.modalType = 'NEW';
    this.selectedUserInfo = null;
    this.openIndividualModal();
  }
  editStore(user){
    this.modalType = 'EDIT';
    this.selectedUserInfo = user;
    console.log('Editing User --- ');
    console.log(this.selectedUserInfo);

    if(this.globals.currentUserRoleId == 4){
      this.globals.showErrorMessage('You are not allowed to do this action');
    }else if(this.globals.currentUserRoleId == 3){
      if(parseInt(this.selectedUserInfo.role_id) == 4){
        this.openIndividualModal();
      }else{
        this.globals.showErrorMessage('You are not allowed to do this action');
      }
    }else{
      this.openIndividualModal();
    }



  }

  openDeleteConfirmDialog(user){

    if(this.globals.currentUserRoleId == 4){
      this.globals.showErrorMessage('You are not allowed to do this action');
      return;
    }else if(this.globals.currentUserRoleId == 3){
      if(parseInt(user.role_id) == 4){
        /* nothing to do */
      }else{
        this.globals.showErrorMessage('You are not allowed to do this action');
        return;
      }
    }


    console.log('Selected User for Delete');
    console.log(user);

    let additionalMsg = '';
    if(user.role_id == 3){
      additionalMsg = 'Will be removed from associated teams as well';
    }else{
      additionalMsg = 'Will be removed from associated teams as well';
    }


    swal.fire({
      html:'<span style="font-size:large;">Are you sure to delete </span> <span style="font-size:large; color:red; font-weight:bold;">'+user.firstname+' '+user.lastname+' ?</span> <br/> <span style="font-size:small; line-height: 3;">'+additionalMsg+'</span>',
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
        this.sendDeleteRequestToServer(user.user_id, user.firstname+' '+user.lastname);
      }
    })
  }

  sendDeleteRequestToServer(user_id, user_name){
    this.globals.showLoading('Please wait');
    this.userService.deleteUser(user_id).subscribe(
      (result) => {
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.showMessageAndLoadValues('User deleted successfully');
          this.createUserLog('User deleted successfully.',user_id);
        }else{
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
      },
      (error) => {
        console.log('Error Block');
        console.log(error);
        try{
          let errorDetails = error.error.detailedMsg.originalError.info.message;
          if(errorDetails.indexOf('dbo.ps_teams') != -1){
            this.globals.showErrorMessage('Please delete teams which are managing by '+user_name);
          }else{
            this.globals.showErrorMessage('Something went wrong. Please try later!');
          }
        }catch(e){
          //nothing to do
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
      }
    );

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
          this.loadUsers();
        }
    });
  }

  getSearchDetailsFromServer(){
    console.log(
      'Search method called'
    );
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

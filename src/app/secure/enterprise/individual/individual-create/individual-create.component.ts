import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { UserService,EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { Constants } from 'src/app/global/app.global.constants';
import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-individual-create',
  templateUrl: './individual-create.component.html',
  styleUrls: ['./individual-create.component.css']
})
export class IndividualCreateComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  public individualData;
  public modalType;
  public type;

  currentEnterpriseId: string = '';
  allUsers:any = [];
  individualRoles: any = [];
  mainButtonText: string = 'Create Individual';
  role_id: string = '';
  individualInfo = {
    "username": "",
    "password": "",
    "firstname": "",
    "lastname": "",
    "email": "",
    "profile_photo": "assets/img/account.svg",
    "role_id": '',
    "enterprise_id": '',
    "designation": "",
    "employee_id": "",
    "phone_number": ""
  };
  userLogs: UserLog = new UserLog();

  constructor( public bsModalRef: BsModalRef, private userService:UserService, private globals: GlobalService,private enterpriseService:EnterpriseService) {
   }

   setRole(){
    console.log('Selected role id:' + this.individualInfo.role_id);

   }

  ngOnInit() {
    console.log('Modal Type:' + this.modalType);
    console.log('From pupup');
  console.log(this.allUsers);

    if(this.modalType == 'EDIT'){
      this.individualInfo = Object.assign({}, this.individualData);
      if(this.individualInfo.profile_photo == '' || this.individualInfo.profile_photo == 'null'){
        this.individualInfo.profile_photo = 'assets/img/account.svg';
      }
    }

    var allRoles = this.individualRoles;
    var requiredRoles = [];
    for(var i =0; i<this.individualRoles.length;i++){
      if(this.globals.currentUserRoleId == 2){
        if(this.individualRoles[i].role_id == 3 || this.individualRoles[i].role_id == "3"){
          requiredRoles.push(this.individualRoles[i]);
        }
        if(this.individualRoles[i].role_id == 4 || this.individualRoles[i].role_id == "4"){
          requiredRoles.push(this.individualRoles[i]);
        }
        if(this.individualRoles[i].role_id == 2 || this.individualRoles[i].role_id == "2"){
          requiredRoles.push(this.individualRoles[i]);
        }
      }else if(this.globals.currentUserRoleId == 3){
        if(this.individualRoles[i].role_id == 4 || this.individualRoles[i].role_id == "4"){
          requiredRoles.push(this.individualRoles[i]);
        }
      }else if(this.globals.currentUserRoleId == 4){
        requiredRoles = [];
      }

    }
    this.individualRoles = requiredRoles;

    let currentUserInfo = localStorage.getItem('currentUser');
    if(currentUserInfo != null && currentUserInfo != undefined){
      var currentUserObj = JSON.parse(currentUserInfo);
      this.currentEnterpriseId = currentUserObj.user.enterprise_id;
    }
    console.log('from popup end');
    if(this.modalType == 'EDIT'){
      this.mainButtonText = 'Update Individual';
    }
  }

  onFileChanged(event) {

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let fileZie = event.target.files[0].size;
    console.log('File Size');
    console.log(fileZie);
    if(fileZie <= 512000){
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        //console.log(e);
        this.individualInfo.profile_photo = e.target.result;
      console.log(this.individualInfo);
      }, (err => {
        console.log(err);
        this.individualInfo.profile_photo = "assets/img/account.svg";
      });
    }else{
      this.globals.showErrorMessage('Profile Image max size is 500KB.');
      return;
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
          this.event.emit('true');
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

  generateRandomPassword(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  createIndividual() {

    let userdata = {
      username: this.individualInfo.email,
      password: this.generateRandomPassword(6),
      firstname: this.individualInfo.firstname,
      lastname: this.individualInfo.lastname,
      email: this.individualInfo.email,
      profile_photo: this.individualInfo.profile_photo,
      role_id: this.individualInfo.role_id,
      enterprise_id:  this.currentEnterpriseId,
      employee_id: this.individualInfo.employee_id,
      designation: this.individualInfo.designation,
      phone_number: this.individualInfo.phone_number,
    };

    let isEmailIdAlreadyExists = false;
    if(this.modalType == 'NEW'){
      console.log('Came here');
      for(var i = 0; i< this.allUsers.length; i++) {
        console.log(userdata.email, this.allUsers[i].user_name);
        if(userdata.email == this.allUsers[i].user_name) {
          isEmailIdAlreadyExists = true;
          break;
        }
      }
    }

    console.log('Is User Exists:'+ isEmailIdAlreadyExists);
    //return;

    if(isEmailIdAlreadyExists) {
        this.globals.showErrorMessage('Email already exists. Please choose another email!');
    }else {
      this.globals.showLoading('Please wait');
      if(this.modalType == 'NEW'){
        this.userService.createUser(userdata).subscribe(
          (result) => {
            console.log(result);
            if(result.status==200){
              console.log(result.body.user_id);
              var userID=result.body.user_id;
              this.enterpriseService.createActionsCategorydefault(this.globals.currentEnterpriseId,userID).subscribe((result)=>{
                console.log(result)
              })
              // this.createActionsCategoryDefaultUrl
              // this.sweetAlertDisplay("Individual Created successfully", true);
              this.event.emit('true');
              this.bsModalRef.hide();
              this.createUserLog('Individual Created successfully.',userdata);
            }else if(result.status==409){
              this.globals.showErrorMessage('Email already exists. Please choose another email!');
            }


          },
          (error) => {
            if(error.status==409){
              this.globals.showErrorMessage('Email already exists. Please choose another email!');
            }else{
              this.globals.showErrorMessage('Something went wrong. Please try later!');
            }
            console.log('Error Block');
            console.log(error);
          }
        );
      }else{

        this.userService.updateUser(this.individualData.user_id, userdata).subscribe(
          (result) => {
            // this.sweetAlertDisplay("Individual Updated successfully", true);
            this.event.emit('true');
            this.bsModalRef.hide();
            this.createUserLog('Individual Updated successfully for this user: '+this.individualData.user_id,userdata);

          },
          (error) => {
            this.globals.showErrorMessage('Something went wrong. Please try later!');
            console.log('Error Block');
            console.log(error);
          }
        );
      }
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  openDeleteConfirmDialog(){

    swal.fire({
      html:'<span style="font-size:large;">Are you sure to delete </span> <span style="font-size:large; color:red; font-weight:bold;">'+this.individualInfo.firstname+' '+this.individualInfo.lastname+' ?</span>',
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
        this.sendDeleteRequestToServer(this.individualData.user_id);
      }
    })
  }

  sendDeleteRequestToServer(user_id){
    this.globals.showLoading('Please wait');
    this.userService.deleteUser(user_id).subscribe(
      (result) => {
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.sweetAlertDisplay("User deleted successfully", true);
          this.createUserLog('User deleted successfully.',user_id);

        }else{
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
      },
      (error) => {
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log('Error Block');
        console.log(error);
      }
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

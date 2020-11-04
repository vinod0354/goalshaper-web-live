import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import swal from 'sweetalert2';
import { GlobalService } from 'src/app/global/app.global.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-poprofile',
  templateUrl: './poprofile.component.html',
  styleUrls: ['./poprofile.component.css']
})
export class PoprofileComponent implements OnInit {

  userLogs: UserLog = new UserLog();

  profiledata: any;
  currentUserInfo: any;
  user_phone_number:string;

  constructor(private userService:UserService, private globals:GlobalService) {

    this.profiledata = localStorage.getItem('currentUser');
    this.currentUserInfo = JSON.parse(this.profiledata).user;
    console.log(this.currentUserInfo);
    if(this.currentUserInfo.profile_photo){
    }else{
      this.currentUserInfo.profile_photo = "assets/img/account.svg";
    }
  }

  ngOnInit() {
  }

  onSubmit(){
      console.log('Clicked Profile Save Method');

      var userProfileData = {};
      userProfileData["username"] = this.currentUserInfo.user_name;
      // userProfileData["password"] = this.generateRandomPassword(6);
      userProfileData["firstname"] = this.currentUserInfo.firstname;
      userProfileData["lastname"] = this.currentUserInfo.lastname;
      userProfileData["email"] = this.currentUserInfo.email;
      userProfileData["profile_photo"] = this.currentUserInfo.profile_photo;
      userProfileData["role_id"] = this.currentUserInfo.role_id;
      userProfileData["enterprise_id"] = this.currentUserInfo.enterprise_id;
      userProfileData["designation"] = this.currentUserInfo.designation;
      userProfileData["employee_id"] = this.currentUserInfo.employee_id;
      userProfileData["phone_number"] = this.currentUserInfo.phone_number;
      console.log(userProfileData);

			this.globals.showLoading(Constants.MSG_PLEASE_WAIT);
      this.userService.updateUser(this.currentUserInfo.user_id, userProfileData).subscribe(
        (result) => {
          this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);
          console.log(result);
          if (result.status == Constants.HTTP_STATUS_OK) {
               // Get back "currentUserInfo" from local storage
              var currentUserInfoEdit = JSON.parse(localStorage.getItem("currentUser"));
              console.log("***");
              console.log(currentUserInfoEdit);
              console.log(this.currentUserInfo);
              // Change value
              if (currentUserInfoEdit.user != undefined && currentUserInfoEdit.user != '' && currentUserInfoEdit.user != 'undefined') {
               currentUserInfoEdit.user.user_name = this.currentUserInfo.user_name;
               currentUserInfoEdit.user.role_id = this.currentUserInfo.role_id;
               currentUserInfoEdit.user.enterprise_id = this.currentUserInfo.enterprise_id;

               currentUserInfoEdit.user.firstname = this.currentUserInfo.firstname;
               currentUserInfoEdit.user.lastname = this.currentUserInfo.lastname;
               currentUserInfoEdit.user.email = this.currentUserInfo.email;
               currentUserInfoEdit.user.profile_photo = this.currentUserInfo.profile_photo;
               currentUserInfoEdit.user.designation = this.currentUserInfo.designation;
               currentUserInfoEdit.user.employee_id = this.currentUserInfo.employee_id;
               currentUserInfoEdit.user.phone_number = this.currentUserInfo.phone_number;

               this.globals.userProfilePhoto = this.currentUserInfo.profile_photo;
              // Save the new currentUserInfo with updated values
               localStorage.setItem('currentUser', JSON.stringify(currentUserInfoEdit));
               this.globals.profileupdated.next(currentUserInfoEdit);

            }
              // this.globals.showSuccessMessage('Profile Data Updated successfully.');
              this.createUserLog('Profile Data Updated successfully for this User: '+this.currentUserInfo.user_id,userProfileData);
          }
          else{
              this.globals.showErrorMessage('Failed to Updata data.');
          }
        },
        (error) => {
          this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);
          this.globals.showErrorMessage('Failed to Updata data.');
          console.log(error);
        }
      );
  }

  onSelectFile(event){
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let fileZie = event.target.files[0].size;
    console.log('File Size');
    console.log(fileZie);
    if(fileZie <= 512000){
      reader.onload = (e: any) => {
        this.currentUserInfo.profile_photo = e.target.result;
      }, (err => {
        console.log(err);
        this.currentUserInfo.profile_photo = "assets/img/account.svg";
      });
    }else{
      this.globals.showErrorMessage('Profile Image max size is 500KB.');
      return;
    }
  }


  createUserLog(activity, description){
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

  deleteProfilePhoto(){
    this.currentUserInfo.profile_photo = "assets/img/account.svg";
    this.onSubmit();
  }

}

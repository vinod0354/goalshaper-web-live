import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { Constants } from '../../../global/app.global.constants';
import { AuthenticationService, UserService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';

@Component({
	selector: 'app-changepassword',
	templateUrl: './changepassword.component.html',
	styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

	/* Strings Section */
	strChangePassword: string = null;
	strCurrentPassword: string = null
	strNewPassword: string = null;
	strConfirmPassword: string = null;
	strCurrentPasswordRequired: string = null;
	strNewPasswordRequired: string = null;
	strConfirmPasswordRequired: string = null;
	strConfirmPasswordNotMatched: string = null;
	strBtnClose: string = null;

	current_password: string = null;
	new_password: string = null;
	confirm_password: string = null;

	userLogs: UserLog = new UserLog();

	angChangePassword: FormGroup;
	constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, private authenticationService: AuthenticationService, private globals: GlobalService, private userService:UserService) {
		this.initProcess();
	}

	initProcess() {
		this.strChangePassword = Constants.MSG_CHANGE_PASSWORD;
		this.strNewPassword = Constants.MSG_NEW_PASSWORD;
		this.strCurrentPassword = Constants.MSG_CURRENT_PASSWORD;
		this.strConfirmPassword = Constants.MSG_CONFIRM_PASSWORD;
		this.strCurrentPasswordRequired = Constants.MSG_CURRENT_PASSWORD_REQUIRED;
		this.strNewPasswordRequired = Constants.MSG_NEW_PASSWORD_REQUIRED;
		this.strConfirmPasswordRequired = Constants.MSG_CONFIRM_PASSWORD_REQUIRED;
		this.strConfirmPasswordNotMatched = Constants.MSG_CONFIRM_PASSWORD_NOT_MATCHED;
		this.strBtnClose = Constants.BTN_CLOSE;
	}

	onSubmit() {
		console.log('Change Password Method Fired');

		const currentUser: any = this.authenticationService.currentUserValue;
		console.log(currentUser);

		let cpwdObj = {
			"username": currentUser.user.user_name,
			"oldPassword": this.current_password,
			"newPassword": this.new_password
		}
		let validation_check = true;

		if (this.new_password == this.current_password) {
			this.globals.showErrorMessage("Current password & new Password can't be same.");
			return;
		} else if (this.new_password != this.confirm_password) {
			this.globals.showErrorMessage("New password & confirm Password does not match.");
			return;
		} else {
			this.globals.showLoading(Constants.MSG_PLEASE_WAIT);

			this.authenticationService.changePassword(cpwdObj).subscribe((result) => {
				this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);

				console.log(result.body);
				if (result.status == Constants.HTTP_STATUS_OK) {
					swal.fire({
						title: 'Password Changed Successfully. ',
						html: '<span style="font-size:medium; color: #0072bb;">You will be redirected to login page.</span>',
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
							//this.angChangePassword.reset();
							this.bsModalRef.hide();
							this.authenticationService.logout();
							this.createUserLog('Password Changed Successfully.',cpwdObj);
						}
					});
				} else if (result.status == Constants.HTTP_STATUS_PRECONDITION_FAILED) {
					this.globals.showErrorMessage("Current password & new Password can't be same.");
				} else if (result.status == Constants.HTTP_STATUS_NOT_MATCHED) {
					this.globals.showErrorMessage('Username & Password not matched.');
				} else if (result.status == Constants.HTTP_STATUS_INVALID_INPUT) {
					this.globals.showErrorMessage('Invalid input. Please check input agian!');
				} else {
					this.globals.showErrorMessage('Something went wrong. Please try later!');
				}
			}, (error) => {
				if (error.status == Constants.HTTP_STATUS_PRECONDITION_FAILED) {
					this.globals.showErrorMessage("Current password & new Password can't be same.");
				} else if (error.status == Constants.HTTP_STATUS_NOT_MATCHED) {
					this.globals.showErrorMessage('Username & Password not matched.');
				} else {
					this.globals.showErrorMessage('Something went wrong. Please try later!');
				}
				console.log(error);
			});

		}




	}

	ngOnInit() {
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
}
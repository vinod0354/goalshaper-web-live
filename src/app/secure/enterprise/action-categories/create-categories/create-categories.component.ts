import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';

import { UserService, EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { Constants } from 'src/app/global/app.global.constants';
import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-create-categories',
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.css']
})
export class CreateCategoriesComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  public modalType;
  public modalData;
  public filterList;

  categoryName:string = '';
  categoryDescription:string = '';
  categoryColor:string = '';

  currentEnterpriseId: string = '';
  ButtonText:string = 'Save';
  // categories: any = [];
  actionInfo = {
    "name": "",
    "description": "",
    "color": "",
    "enterprise_id": "",
    "user_id": "",
  }
  userLogs: UserLog = new UserLog();

  constructor(public bsModalRef: BsModalRef, public globals: GlobalService, public userService: UserService, public enterpriseService: EnterpriseService) { }

  ngOnInit() {
    console.log(this.modalType);
    console.log(this.filterList);
    if(this.modalType == 'EDIT'){
      this.actionInfo = this.modalData;
      this.categoryName = this.actionInfo.name;
      this.categoryDescription = this.actionInfo.description;
      this.categoryColor = this.actionInfo.color;

      this.ButtonText = 'Update';
    }

    for(var i =0; i<this.filterList.length; i++){
      if(this.filterList[i].toLowerCase() == this.modalData.name.toLowerCase()){
        this.filterList.splice(i, 1);
      }
    }

    // let currentUserInfo = localStorage.getItem('currentUser');
    // if(currentUserInfo != null && currentUserInfo != undefined){
    //   var currentUserObj = JSON.parse(currentUserInfo);
    //   this.currentEnterpriseId = currentUserObj.user.enterprise_id;
    // }
    console.log('from popup end');
  }

  closeModal(){
    this.bsModalRef.hide();
  }

  sweetAlertDisplay(title, status) {

    if (status == true) {
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

  //To create category
  createCategory() {
    if(this.filterList.includes(this.categoryName)){
      console.log("Duplicate Name");
      this.sweetAlertDisplay('Duplicate names are not allowed.',false);
    } else{
      let data = {
        name: this.categoryName,
        description: this.categoryDescription,
        color: this.categoryColor,
        enterprise_id: this.globals.currentEnterpriseId,
        user_id: this.globals.currentUserId.toString(),
      };
  
      console.log('Extraction Data:');
      console.log(JSON.stringify(data));
  
      this.globals.showLoading('Please wait');
        if(this.modalType == 'NEW'){
          this.enterpriseService.createActionCategory(data).subscribe(
            (result) => {
              console.log(result);
              // this.sweetAlertDisplay("Category Created successfully", true);
              this.event.emit('true');
              this.bsModalRef.hide();
              this.createUserLog('Category Created successfully.',data);
            },
            (error) => {
              this.globals.showErrorMessage('Something went wrong. Please try later!');
              console.log('Error Block');
              console.log(error);
            }
          );
        }else{
          console.log(this.modalData.category_id);
          this.enterpriseService.updateActionCategory(data, this.modalData.category_id,).subscribe(
            (result) => {
              console.log(result);
              // this.sweetAlertDisplay("Category Updated successfully", true);
              this.event.emit('true');
              this.bsModalRef.hide();
              this.createUserLog('Category Updated successfully for this user: '+data, this.modalData.category_id);
  
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

  //User Log
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

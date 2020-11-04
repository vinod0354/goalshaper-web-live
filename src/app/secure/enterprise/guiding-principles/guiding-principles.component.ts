import { Component, OnInit ,ChangeDetectorRef, ChangeDetectionStrategy, Pipe } from '@angular/core';
import { GlobalService } from 'src/app/global/app.global.service';
import { EnterpriseService, UserService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import * as _ from "lodash"
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-guiding-principles',
  templateUrl: './guiding-principles.component.html',
  styleUrls: ['./guiding-principles.component.css'],
  //changeDetection: ChangeDetectionStrategy.Default
})

export class GuidingPrinciplesComponent implements OnInit {

  EditPurpose = false;

  public enterpriseData;
  currentUserInfo: any;
  profiledata: any;
  enterprisedata: any;
  enterpriseInfo: any;
  principles: any=[];
  individual: any=[];
  clickedIndex: number = 0;
  roleId: number = 0;
  saveBtn = false;
  showEdit = false;

  gpdata: any = {
    "details_id": "",
    "enterprise_id": "",
    "gp_id": "",
    "gp_alias_name": "",
    "details": "",
    "user_id": ""
  }

  changeTextHead = { };
  changeTextHeader = { };
  changeText = { };
  changeText2 = { };

  showInput = false;
  showText = true;

  constructor(private userService:UserService,private globals:GlobalService, private enterpriseService:EnterpriseService, private changeDetection: ChangeDetectorRef) { 
    this.roleId = this.globals.currentUserRoleId;
    this.loadprinciples();
    this.profiledata = localStorage.getItem('currentUser');
    this.currentUserInfo = JSON.parse(this.profiledata).user;
    console.log(this.currentUserInfo);
    if(this.currentUserInfo.profile_photo){
    }else{
      this.currentUserInfo.profile_photo = "assets/img/account.svg";
    }
    this.enterprisedata = localStorage.getItem('Enterprises')
    this.enterpriseInfo = JSON.parse(this.enterprisedata);
    console.log(this.enterpriseInfo);
  }

  ngOnInit() {
    var EnterpriseId = this.globals.currentEnterpriseId;
    console.log(EnterpriseId);
    this.globals.showLoading('Please wait');

    this.enterpriseService.togetEnterpriseIngo(EnterpriseId).subscribe(
      (result) => {
        this.globals.hideLoading('Please wait');

        if (result.status == Constants.HTTP_STATUS_OK) {
        this.enterpriseData = result.body;
        console.log(this.enterpriseData)
        this.loadEnterprisesInfo(this.enterpriseData);
        }else{
          console.log(result);
          return;
        }
      },err=>{
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log(err);
      });
  }

  //Show Icon
  showIcon(index,field,group) {
    if(group == 'individual'){ 
      this.individual[index][field] = true
    }else {
      this.principles[index][field] = true
    }
  }

  hideIcon(index,field,group) {
    if(group == 'individual'){
      this.individual[index][field] = false
      console.log( this.individual)
    }else{
      this.principles[index][field] = false
    }
   
  }

  loadprinciples(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getgprinciples(this.globals.currentEnterpriseId, this.globals.currentUserId).subscribe(
      (resData:any)=> {
        this.globals.hideLoading('Please wait');
        console.log(resData); 
      //  const editFields = {'gp_alias_name_edit':false,'details_edit':false,'title_clicked':false,'details_clicked':false}
        resData.body.forEach(element => {
          element.gp_alias_name_edit = false;
          element.details_edit = false;
          element.title_clicked = false;
          element.details_clicked = false;
           
         });
         console.log(resData.body)

        this.principles=resData.body.filter(x => x.level_name != 'Individual');
        this.individual=resData.body.filter(x => x.level_name == 'Individual');
      },err => {
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      }
    );
  }

  //Enterprise Data
  public enterpriseinfo = []
  public allEnterprises = [];
  loadEnterprisesInfo(data) {
    this.allEnterprises.push(data);
    
    localStorage.setItem('Enterprises', JSON.stringify(this.allEnterprises));
    console.log(this.allEnterprises);
    this.togetEnterpriseinfo(this.enterpriseinfo)
  }

  togetEnterpriseinfo(data) {
    console.log(data);
    for (let value of data) {
      // console.log(value);
      this.enterpriseData = value;
    }
    this.enterpriseInfo = {
      name: this.enterpriseData.name,
      logo: this.enterpriseData.logo,
      contact_name: this.enterpriseData.contact_name,
    };
  }

  onEvent(index,field,group,parent){
    let obj:any = "";
    if(group == 'individual'){ 
      this.individual[index][field] = false
      this.individual[index]['gp_alias_name_edit'] = false
      this.individual[index]['details_edit'] = false
      if(parent == "gp_alias_name"){
        this.individual[index] ['gp_alias_name'] =  this.gpdata.details
      }else{
        this.individual[index] ['details'] =  this.gpdata.details
      }
      obj = this.individual[index]
    }else {
      this.principles[index][field] = false
      this.principles[index]['gp_alias_name_edit'] = false
      this.principles[index]['details_edit'] = false
      if(parent == "gp_alias_name"){
        this.principles[index] ['gp_alias_name'] =  this.gpdata.details
      }else{
        this.principles[index] ['details'] =  this.gpdata.details
      }
      obj = this.principles[index]
    }
    this.gpdata.details ="";
      if(obj){
          delete obj.gp_alias_name_edit
          delete obj.details_edit
          delete obj.title_clicked
          delete obj.detail_clicked
          
      console.log("obj",obj)
      this.enterpriseService.updateprinciples([obj]).subscribe((res:any)=>{
        console.log(res)
      },err =>{
        console.log("err",err)
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      })
    }
  }

  editItem(index,field,group,value) {
  
    if(group == 'individual'){ 
      this.individual[index][field] = true
    }else{
      this.principles[index][field] = true
      console.log( this.principles)
    }
    this.gpdata.details = value
  }

  onSelectFile(event){
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let fileZie = event.target.files[0].size;
    console.log('File Size');
    console.log(fileZie);
    if(fileZie <= 512000){
      reader.onload = (e: any) => {
        this.enterpriseInfo.logo = e.target.result;
        this.onSubmit();
      }, (err => {
        console.log(err);
        this.enterpriseInfo.logo = "assets/img/noimage-black.png";
      });
    }else{
      this.globals.showErrorMessage('Image max size is 500KB.');
      return;
    }
  }

  onSubmit(){
    var entData = {};
    entData["name"] = this.enterpriseData.name;
    entData["category_id"] = this.enterpriseData.category_id;
    entData["email"] = this.enterpriseData.email;
    entData["website"] = this.enterpriseData.website;
    entData["logo"] = this.enterpriseInfo.logo;
    entData["contact_name"] = this.enterpriseData.contact_name;
    entData["contact_title"] = this.enterpriseData.contact_title;
    entData["contact_email"] = this.enterpriseData.contact_email;
    entData["contact_phone"] = this.enterpriseData.contact_phone;
    entData["email_notification"] = this.enterpriseData.email_notification;
    entData["push_notification"] = this.enterpriseData.push_notification;
    entData["goalsmanagement_notification"] = this.enterpriseData.goalsmanagement_notification;
    entData["objectivesmanagement_notification"] = this.enterpriseData.objectivesmanagement_notification;
    entData["actionsmanagement_notification"] = this.enterpriseData.actionsmanagement_notification;
    entData["themechanges_notification"] = this.enterpriseData.themechanges_notification;
    entData["address_line1"] = this.enterpriseData.address_line1;
    entData["address_line2"] = this.enterpriseData.address_line2;
    entData["city_id"] = this.enterpriseData.city_id;
    entData["state_id"] = this.enterpriseData.state_id;
    entData["country_id"] = this.enterpriseData.country_id;
    entData["pincode"] = this.enterpriseData.pincode;
    this.globals.showLoading(Constants.MSG_PLEASE_WAIT);
    this.enterpriseService.updateEnterprise(this.globals.currentEnterpriseId, entData).subscribe(
      (result)=>{
        this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);
        console.log(result);
        this.saveBtn = false;
      },
      (error) => {
        this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);
        this.globals.showErrorMessage('Failed to Updata data.');
        console.log(error);
      }
    );
  }

}
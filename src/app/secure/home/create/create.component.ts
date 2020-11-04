import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EnterpriseService, UserService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { Constants } from 'src/app/global/app.global.constants';
import { EnterpriseCategory } from 'src/app/models/enterprise';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Country } from 'src/app/models/geolocation';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';



@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  //@Output() action = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  public enterpriseData;
  public type;


  contactTitle: string = "Mr";
  enterpriseCategories: EnterpriseCategory[] = [];
  title: string;
  enterpriseCategory: number = 0;
  countries: any[] = [];
  noResultForCountries = false;
  noResultForStates = false;
  noResultForCities = false;
  typeaheadLoadingForCountries: boolean;
  typeaheadLoadingForStates: boolean;
  typeaheadLoadingForCities: boolean;
  selectedCountryId: number = 0;
  selectedStateId: number = 0;
  selectedCityId: number = 0;
  enterpriseCountry: string = '';
  enterpriseState: string = '';
  enterpriseCity: string = '';
  states: any[] = [];
  cities: any[] = [];
  enterpriseId: string = '';
  userId: string = '';

  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  mainButtonText: string = 'Create Enterprise';

  enterpriseInfo = {
    "name": "",
    "category_id": '',
    "email": "",
    "website": "",
    "logo": "assets/img/noimage-black.png",
    "contact_name": "",
    "contact_title": "Mr",
    "contact_email": "",
    "contact_phone": "",
    "email_notification": false,
    "push_notification": false,
    "goalsmanagement_notification": false,
    "objectivesmanagement_notification": false,
    "actionsmanagement_notification": false,
    "themechanges_notification": false,
    "address_line1": "",
    "address_line2": "",
    "city_id": '',
    "state_id": '',
    "country_id": '',
    "pincode": ""
  };




  enterpriseName: string = '';
  createEnterprise: FormGroup;
  userLogs: UserLog = new UserLog();


  constructor(private fb: FormBuilder, private userService:UserService, private modalService: BsModalService, public bsModalRef: BsModalRef, private enterpriseService: EnterpriseService, private globals: GlobalService, private geolocationService: GeolocationService) {

  }

  getContryForSearch() {


  }



  onSelectCountry(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
    this.selectedCountry = e.value;
    let selectedCountryArray: any = this.countries.filter(x => x.name == e.value);
    console.log('Selected Object');
    console.log(selectedCountryArray);
    this.selectedCountryId = selectedCountryArray[0].country_id;
    console.log('Selected Country Id To Pass Database');
    console.log(this.selectedCountryId);

  }

  onSelectState(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
    this.selectedState = e.value;
    let selectedStateArray: any = this.states.filter(x => x.name == e.value);
    console.log('Selected Object');
    console.log(selectedStateArray);
    this.selectedStateId = selectedStateArray[0].state_id;
    console.log('Selected Country Id To Pass Database');
    console.log(this.selectedStateId);
  }

  onSelectCity(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
    this.selectedCity = e.value;
    let selectedCityArray: any = this.cities.filter(x => x.name == e.value);
    console.log('Selected Object');
    console.log(selectedCityArray);
    this.selectedCityId = selectedCityArray[0].city_id;
    console.log('Selected State Id To Pass Database');
    console.log(this.selectedCityId);
  }

  typeaheadNoResultsForCountries(event: boolean): void {
    //this.noResultForCountries = event;
  }

  typeaheadLoadingMethodForCountries(e: boolean): void {
    if (this.selectedCountry != '' || this.selectedCountry != undefined) {
      this.typeaheadLoadingForCountries = true;
      this.noResultForCountries = false;
    }


    this.geolocationService.getCountries(this.selectedCountry).subscribe(
      (result) => {
        this.typeaheadLoadingForCountries = false;
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.countries = result.body;
          if (this.countries.length > 0) {
            if (this.selectedCountry != '' || this.selectedCountry != undefined) {
              this.noResultForCountries = false;
            }
          } else {
            if (this.selectedCountry != '' || this.selectedCountry != undefined) {
              this.noResultForCountries = true;
            }
          }
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.countries = [];
          if (this.selectedCountry != '' || this.selectedCountry != undefined) {
            this.noResultForCountries = true;
          }
        } else {
          this.countries = [];
          if (this.selectedCountry != '' || this.selectedCountry != undefined) {
            this.noResultForCountries = true;
          }
        }
      },
      (error) => {
        this.countries = [];
        console.log('Error Block');
        console.log(error);
        this.noResultForCountries = true;
        this.typeaheadLoadingForCountries = false;
      }
    );
  }


  typeaheadNoResultsForStates(event: boolean): void {
    // this.noResultForStates = event;
  }



  typeaheadLoadingMethodForStates(e: boolean): void {
    if (this.selectedState != '' || this.selectedState != undefined) {
      this.typeaheadLoadingForStates = true;
      this.noResultForStates = false;
    }


    this.geolocationService.getStates(this.selectedState, this.selectedCountryId).subscribe(
      (result) => {
        this.typeaheadLoadingForStates = false;
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.states = result.body;
          if (this.states.length > 0) {
            if (this.selectedState != '' || this.selectedState != undefined) {
              this.noResultForStates = false;
            }
          } else {
            if (this.selectedState != '' || this.selectedState != undefined) {
              this.noResultForStates = true;
            }
          }
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.states = [];
          if (this.selectedState != '' || this.selectedState != undefined) {
            this.noResultForStates = true;
          }
        } else {
          this.states = [];
          if (this.selectedState != '' || this.selectedState != undefined) {
            this.noResultForStates = true;
          }
        }
      },
      (error) => {
        this.states = [];
        console.log('Error Block');
        console.log(error);
        this.noResultForStates = true;
        this.typeaheadLoadingForStates = false;
      }
    );
  }




  typeaheadNoResultsForCities(event: boolean): void {
    // this.noResultForCities = event;
  }


  typeaheadLoadingMethodForCities(e: boolean): void {
    if (this.selectedCity != '' || this.selectedCity != undefined) {
      this.typeaheadLoadingForCities = true;
      this.noResultForCities = false;
    }


    this.geolocationService.getCities(this.selectedCity, this.selectedStateId).subscribe(
      (result) => {
        this.typeaheadLoadingForCities = false;
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.cities = result.body;
          if (this.cities.length > 0) {
            if (this.selectedCity != '' || this.selectedCity != undefined) {
              this.noResultForCities = false;
            }
          } else {
            if (this.selectedCity != '' || this.selectedCity != undefined) {
              this.noResultForCities = true;
            }
          }
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.cities = [];
          if (this.selectedCity != '' || this.selectedCity != undefined) {
            this.noResultForCities = true;
          }
        } else {
          this.cities = [];
          if (this.selectedCity != '' || this.selectedCity != undefined) {
            this.noResultForCities = true;
          }
        }
      },
      (error) => {
        this.cities = [];
        console.log('Error Block');
        console.log(error);
        this.noResultForCities = true;
        this.typeaheadLoadingForCities = false;
      }
    );
  }



  ngOnInit() {
    console.log('Enterprise Catogires in Modal:');
    console.log(this.enterpriseCategories);
    console.log(this.title);

    console.log("@@@@@@@@@@@@@@@@@@");
    console.log(this.enterpriseData);
    console.log(this.type);

    if (this.type == 'EDIT') {
      this.mainButtonText = 'Update Enterprise';
      this.selectedCountry = this.enterpriseData.country_name;
      this.selectedState = this.enterpriseData.state_name;
      this.selectedCity = this.enterpriseData.city_name;
      this.enterpriseId = this.enterpriseData.enterprise_id;
      this.enterpriseInfo = {
        name: this.enterpriseData.name,
        category_id: this.enterpriseData.category_id,
        email: this.enterpriseData.email,
        website: this.enterpriseData.website,
        logo: this.enterpriseData.logo,
        contact_name: this.enterpriseData.contact_name,
        contact_title: this.enterpriseData.contact_title,
        contact_email: this.enterpriseData.contact_email,
        contact_phone: this.enterpriseData.contact_phone,
        email_notification: this.getBoolean(this.enterpriseData.email_notification),
        push_notification: this.getBoolean(this.enterpriseData.push_notification),
        goalsmanagement_notification: this.getBoolean(this.enterpriseData.goalsmanagement_notification),
        objectivesmanagement_notification: this.getBoolean(this.enterpriseData.objectivesmanagement_notification),
        actionsmanagement_notification: this.getBoolean(this.enterpriseData.actionsmanagement_notification),
        themechanges_notification: this.getBoolean(this.enterpriseData.themechanges_notification),
        address_line1: this.enterpriseData.address_line1,
        address_line2: this.enterpriseData.address_line2,
        city_id: this.enterpriseData.city_id,
        state_id: this.enterpriseData.state_id,
        country_id: this.enterpriseData.country_id,
        pincode: this.enterpriseData.pincode
      };
      this.selectedCountryId = this.enterpriseData.country_id;
      this.selectedStateId = this.enterpriseData.state_id;
      this.selectedCityId = this.enterpriseData.city_id;


    }
  }


  getBoolean(value){
    console.log(value)
    switch(value){
         case true:
         case "true":
         case 1:
         case "1":
         case "on":
         case "yes":
        case "TRUE":
             return true;
         default:
             return false;
     }
 }

  setCategory() {
    console.log('Selected Category: ' + this.enterpriseCategory);
  }


  setContactTitle() {
    console.log(this.contactTitle);
  }

  createForm() {

  }

  onSubmit() {
    console.log("Final Enterprise to send to SERVER");
    this.enterpriseInfo.country_id = this.selectedCountryId.toString();
    this.enterpriseInfo.state_id = this.selectedStateId.toString();
    this.enterpriseInfo.city_id = this.selectedCityId.toString();
    console.log(this.enterpriseInfo);

    /* Validations that we are not able to do in html level */

    if(parseInt(this.enterpriseInfo.pincode.toString()) < 10000){
      this.globals.showErrorMessage('Pincode should be atleast 5 digits');
      return;
    }


    if(parseInt(this.enterpriseInfo.contact_phone) < 1000000){
      this.globals.showErrorMessage('Phone number should be atleast 7 digits');
      return;
    }

    if(parseInt(this.enterpriseInfo.country_id) == 0){
      this.globals.showErrorMessage('Please select country from suggestions.');
      return;
    }

    if(parseInt(this.enterpriseInfo.state_id) == 0){
      this.globals.showErrorMessage('Please select state from suggestions.');
      return;
    }

    if(parseInt(this.enterpriseInfo.city_id) == 0){
      this.globals.showErrorMessage('Please select city from suggestions.');
      return;
    }

    /* Website Validation */
    let regExp = new RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$');
    if(!regExp.test(this.enterpriseInfo.website)){
      this.globals.showErrorMessage('Please enter valid website.');
      return;
    }

    if(this.enterpriseInfo.email_notification == false &&
      this.enterpriseInfo.push_notification == false &&
      this.enterpriseInfo.goalsmanagement_notification == false &&
      this.enterpriseInfo.objectivesmanagement_notification == false &&
      this.enterpriseInfo.actionsmanagement_notification == false &&
      this.enterpriseInfo.themechanges_notification == false){
        this.globals.showErrorMessage('Atleast one feature should be enabled');
        return;
      }


    if (this.type == 'NEW') {
      this.globals.showLoading('Please wait');
      this.enterpriseService.createEnterprise(JSON.stringify(this.enterpriseInfo)).subscribe(
        (result) => {
          if(result.status == 200){
            console.log("final result");
            console.log(result);
            this.enterpriseId = result.body.enterprise_id;
            this.createUserLog('Enterprise created successfully',JSON.stringify(this.enterpriseInfo));
            this.createEnterpriseUser();
          }else if(result.status == 409){
            console.log('enterprise email id already exists');
            this.sweetAlertDisplay('Enterprise email already exists. Please Choose other.', false);
          }

        }, (err) => {
          this.globals.hideLoading('Enterprise Creation Failed. Please try later!');
          console.log("final result error");
          console.log(err);
          if(err.status == 409){
              console.log('enterprise email id already exists');
              this.sweetAlertDisplay('Enterprise email already exists. Please Choose other.', false);
          }else{
            this.sweetAlertDisplay("Enterprise Creation Failed", false);
            this.createUserLog('Enterprise Creation Failed','Error');
          }
        });
    } else {
      this.globals.showLoading('Please wait');
      console.log("Calling EDIT API");
      console.log(this.enterpriseId);
      console.log(this.enterpriseInfo);
      this.enterpriseService.updateEnterprise(this.enterpriseId, JSON.stringify(this.enterpriseInfo)).subscribe(
        (result) => {
          console.log("final result");
          console.log(result);
          this.createUserLog('Enterprise updated successfully for this enterpriseId: '+this.enterpriseId,JSON.stringify(this.enterpriseInfo));

          //this.sweetAlertDisplay("Enterprise updated successfully", true);
          // this.event.emit('true');
          // this.bsModalRef.hide();
          this.mapEnterpriseFeatures();

        }, (err) => {
          console.log("final result error");
          console.log(err);
          this.sweetAlertDisplay("Enterprise Update Failed. Please try later", false);
          this.createUserLog('Enterprise Update Failed. Please try later','Error');

        });
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
        this.enterpriseInfo.logo = e.target.result;
      // console.log(e.target.result);
      }, (err => {
        console.log(err);
        this.enterpriseInfo.logo = "assets/img/noImage.png";
      });
    }else{
      this.globals.showErrorMessage('Logo max size is 500KB.');
      return;
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

  createEnterpriseUser() {

    let userdata = {
      username: this.enterpriseInfo.email,
      password: this.generateRandomPassword(6),
      firstname: this.enterpriseInfo.name,
      lastname: this.enterpriseInfo.name,
      email: this.enterpriseInfo.email,
      profile_photo: "",
      role_id: 2,
      enterprise_id: this.enterpriseId
    };

    this.enterpriseService.createUser(JSON.stringify(userdata)).subscribe(
      (result) => {

        console.log("User creation succesful");
        console.log(result);
        this.createUserLog('User creation succesful',JSON.stringify(userdata));
        this.userId = result.body.user_id;
        this.mapEnterpriseUser();
        this.createUserActions(this.userId);

      }, (err) => {
        this.globals.showErrorMessage('Enterprise Creation Failed. Please try later!');
        this.createUserLog('Enterprise Creation Failed. Please try later!','Error');

        console.log("User creation Failed");
        console.log(err);
      });


  }

  createUserActions(userId){
    try{
      this.enterpriseService.createActionsCategorydefault(this.enterpriseId,userId).subscribe((result)=>{
        console.log(result)
      });
    }catch(err){
      console.log('Error while action categoires to user');
    }

  }


  mapEnterpriseFeatures(){
    let enterpriseFeatures = [];
    if(this.enterpriseInfo.email_notification == true){
      enterpriseFeatures.push(1);
    }

    if(this.enterpriseInfo.push_notification ==  true){
      enterpriseFeatures.push(2);
    }

    if(this.enterpriseInfo.goalsmanagement_notification == true){
      enterpriseFeatures.push(3);
    }

    if(this.enterpriseInfo.objectivesmanagement_notification == true){
      enterpriseFeatures.push(4);
    }

    if(this.enterpriseInfo.actionsmanagement_notification == true){
      enterpriseFeatures.push(5);
    }

    if(this.enterpriseInfo.themechanges_notification == true){
      enterpriseFeatures.push(6);
    }

    if(enterpriseFeatures.length > 0){
    this.enterpriseService.mapEnterpriseFeatures(this.enterpriseId, enterpriseFeatures).subscribe(
      (result) => {
        console.log("Enterprise feature mapping succesful");
        console.log(result);
        if(this.type == 'NEW'){
          this.sweetAlertDisplay("Enterprise Created successfully", true);
          this.createUserLog('Enterprise Created successfully for this enterpriseId: '+this.enterpriseId,enterpriseFeatures);
        }else{
          this.sweetAlertDisplay("Enterprise updated successfully", true);
          this.createUserLog('Enterprise updated successfully for this enterpriseId: '+this.enterpriseId,enterpriseFeatures);
        }
      }, (err) => {
        console.log("Enterprise feature mapping Failed");
        console.log(err);
        if(this.type == 'NEW'){
          this.globals.showErrorMessage('Enterprise creation failed. Please try later!');
          this.createUserLog('Enterprise creation failed. Please try later!',"Error");
        }else{
          this.globals.showErrorMessage('Enterprise update failed. Please try later!');
          this.createUserLog('Enterprise update failed. Please try later!',"Error");

        }
      });
    }else{
      this.sweetAlertDisplay("Enterprise Created successfully", true);
      this.createUserLog('Enterprise Created successfully',enterpriseFeatures);
    }
  }


  mapEnterpriseUser() {

    this.enterpriseService.mapEnterpriseUser(this.enterpriseId, this.userId).subscribe(
      (result) => {

        console.log("Enterprise & User mapping succesful");
        console.log(result);
        this.mapEnterpriseFeatures();
        this.createUserLog('Enterprise & User mapping succesful for this enterpriseId: '+this.enterpriseId,this.userId);
        //this.sweetAlertDisplay("Enterprise Created successfully", true);
      }, (err) => {
        console.log("Enterprise & User mapping Failed");
        console.log(err);
        this.globals.showErrorMessage('Enterprise Creation Failed. Please try later!');
        this.createUserLog('Enterprise Creation Failed. Please try later!','Error');

      });


  }

  sweetAlertDisplay(title, status) {



    if (status) {

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
        //html: '<span style="font-size:medium; color: #0072bb;">Something went wrong!! Try Again</span>',
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

  closeModal() {
    this.bsModalRef.hide();
    // this.event.emit('true');

  }

  deleteEnterprise(){
    swal.fire({
      //title: 'Are you sure to delete '+this.enterpriseInfo.name+' ?',
      html:'<span style="font-size:large;">Are you sure to delete </span> <span style="font-size:large; color:red; font-weight:bold;">'+this.enterpriseInfo.name+' ?</span>',
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
        this.sendDeleteRequestToServer();
      }
    })
  }

  sendDeleteRequestToServer(){
    this.globals.showLoading(Constants.MSG_PLEASE_WAIT);
    this.enterpriseService.deleteEnterprise(this.enterpriseId).subscribe(
      (result) => {
        this.globals.showLoading(Constants.MSG_PLEASE_WAIT);
        console.log(result);
        this.sweetAlertDisplay("Enterprise Deleted successfully", true);
        this.createUserLog('Enterprise Deleted successfully',this.enterpriseId);
      }, (err) => {
        console.log(err);
        this.globals.showErrorMessage('Enterprise deletion failed. Please try later!');
        this.createUserLog('Enterprise deletion failed. Please try later!',"Error");
      });
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

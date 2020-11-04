import { Component, OnInit, PipeTransform } from '@angular/core';
import { GlobalService } from '../../global/app.global.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseCategory } from 'src/app/models/enterprise';
import { Constants } from '../../global/app.global.constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreateComponent } from './create/create.component';
import { AuthenticationService } from 'src/app/services';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //allEnterprises: Enterprise[] = [];
  allEnterprises: any = [];
  enterpriseCategories: EnterpriseCategory[];
  modalRef: BsModalRef;
  searchText: string;
	searchBy: any;
	searchFields: {
		name: string;
	};
	filterBy: string = '';
  constructor( private globals:GlobalService,private modalService: BsModalService, private enterpriseService:EnterpriseService, private authenticationService:AuthenticationService ) {


    // var localEnterprises = localStorage.getItem('Enterprises');
    // if(localEnterprises != undefined && localEnterprises != null && localEnterprises != ''){
    //   this.allEnterprises = JSON.parse(localEnterprises);
    // }else{
      this.loadEnterprises();
    //}

    this.loadEnterpriseCategories();
    this.searchBy = { name: this.searchText, country: this.searchText };
  }

  searchResults(text: string, pipe: PipeTransform): Enterprise[] {
    console.log('Before Giving Data');
    console.log(this.allEnterprises);
		return this.allEnterprises.filter((enterprise) => {
			const term = text.toLowerCase();
			return (
				enterprise.name.toLowerCase().includes(term) ||
				pipe.transform(enterprise.country_name).includes(term)
			);
		});
  }


  refreshPageData(){
    this.loadEnterprises();
  }

  refreshSearch() {
		this.searchBy = this.getSearchObject();
	}

	getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			searchObj['name'] = this.searchText;
			searchObj['country_name'] = this.searchText;
		} else if (this.filterBy == 'name') {
			searchObj['name'] = this.searchText;
		} else if (this.filterBy == 'country') {
			searchObj['country_name'] = this.searchText;
		}
		return searchObj;
	}

  createEnterprise(){

  }




  openEnterpriseDetailsModel(){
    const initialState = {
      enterpriseCategories: this.enterpriseCategories,
      type: 'NEW',
      enterpriseData: null
    };
    this.modalRef = this.modalService.show(CreateComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));
    this.modalRef.content.enterpriseData = '';
    this.modalRef.content.type = 'NEW';

    this.modalRef.content.event.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if(data == 'true'){
this.loadEnterprises();
      }
   });

  }

  sendEnterpriseInfoForEdit(enterprise){
    console.log(enterprise);
    const initialState = {
      enterpriseCategories: this.enterpriseCategories,
      type: 'EDIT',
      enterpriseData: enterprise
    }
    // this.modalRef = this.modalService.show(CreateComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));
    this.modalRef = this.modalService.show(CreateComponent, Object.assign({}, this.modalRef, { class: 'gray modal-lg', initialState }));
    this.modalRef.content.enterpriseData = enterprise;
    this.modalRef.content.type = 'EDIT';
    this.modalRef.content.event.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if(data == 'true'){
this.loadEnterprises();
      }
   });
    // // this.modalRef.content.line_item = line_item;
    // this.modalRef.content.doSomeOperationsWithData();
  }

  loadEnterprises(){
    this.globals.showLoading(Constants.MSG_PLEASE_WAIT);
      this.enterpriseService.getAllEnterprises().subscribe(
        (result) => {
          this.globals.hideLoading(Constants.MSG_PLEASE_WAIT);
          if(result.status == Constants.HTTP_STATUS_OK){
            this.allEnterprises = result.body;

            /* Mapping Features start */
            for(var i = 0; i < this.allEnterprises.length; i++){
              var strIds = this.allEnterprises[i].mapping_feature_ids;
              if(strIds.indexOf('Not') == -1){
                var featureIds = strIds.split(',');
                var mapArray = [];
                for(var j = 1; j < 7; j++){
                  var featureFound = false;
                  for(var k = 0; k < featureIds.length; k++){
                    if(parseInt(featureIds[k]) == j){
                      mapArray.push(1);
                      featureFound = true;
                      if(j == 1){
                        this.allEnterprises[i]['email_notification'] = 'true';
                      }
                      if(j == 2){
                        this.allEnterprises[i]['push_notification'] = 'true';
                      }
                      if(j == 3){
                        this.allEnterprises[i]['goalsmanagement_notification'] = 'true';
                      }
                      if(j == 4){
                        this.allEnterprises[i]['objectivesmanagement_notification'] = 'true';
                      }
                      if(j == 5){
                        this.allEnterprises[i]['actionsmanagement_notification'] = 'true';
                      }
                      if(j == 6){
                        this.allEnterprises[i]['themechanges_notification'] = 'true';
                      }

                    }
                  }
                  if(!featureFound){
                    mapArray.push(0);
                    if(j == 1){
                      this.allEnterprises[i]['email_notification'] = 'false';
                    }
                    if(j == 2){
                      this.allEnterprises[i]['push_notification'] = 'false';
                    }
                    if(j == 3){
                      this.allEnterprises[i]['goalsmanagement_notification'] = 'false';
                    }
                    if(j == 4){
                      this.allEnterprises[i]['objectivesmanagement_notification'] = 'false';
                    }
                    if(j == 5){
                      this.allEnterprises[i]['actionsmanagement_notification'] = 'false';
                    }
                    if(j == 6){
                      this.allEnterprises[i]['themechanges_notification'] = 'false';
                    }
                  }
                }
                this.allEnterprises[i]['mapArray'] = mapArray;
              }else{
                this.allEnterprises[i]['mapArray'] = [0,0,0,0,0,0];
                this.allEnterprises[i]['email_notification'] = 'false';
                this.allEnterprises[i]['push_notification'] = 'false';
                this.allEnterprises[i]['goalsmanagement_notification'] = 'false';
                this.allEnterprises[i]['objectivesmanagement_notification'] = 'false';
                this.allEnterprises[i]['actionsmanagement_notification'] = 'false';
                this.allEnterprises[i]['themechanges_notification'] = 'false';
              }
            }

            /* Mapping Features End */
            localStorage.setItem('Enterprises', JSON.stringify(this.allEnterprises));
            console.log(this.allEnterprises);
          }else if(result.status == Constants.HTTP_STATUS_NO_CONTENT){
            this.allEnterprises = [];
            //this.globals.showSuccessMessage('No enterprises available.');
            localStorage.setItem('Enterprises', JSON.stringify(this.allEnterprises));
          }else{
            this.globals.showErrorMessage(Constants.MSG_LOADING_DATA_FAILED);
          }
        },
        (error) => {
          this.globals.showErrorMessage(Constants.MSG_LOADING_DATA_FAILED);
          console.log('Error Block');
          console.log(error);
        }
      );
  }

  loadEnterpriseCategories() {
    this.enterpriseService.getEnterpriseCategories().subscribe(
      (result) => {
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.enterpriseCategories = result.body;
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.enterpriseCategories = [];
        } else {
          this.enterpriseCategories = [];
        }
      },
      (error) => {
        this.enterpriseCategories = [];
        console.log('Error Block');
        console.log(error);
      }
    );
  }


  keepLogoAspectRatio(){
    var imgEnterpriseLogo:any = document.getElementById('imgEnterpriseLogo');
    imgEnterpriseLogo =
    imgEnterpriseLogo.onload = function() {
          if(imgEnterpriseLogo.height > imgEnterpriseLogo.width) {
            imgEnterpriseLogo.height = '100%';
            imgEnterpriseLogo.width = 'auto';
          }
      };
  }

  ngOnInit() {

  }

}

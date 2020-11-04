import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActionsCreateComponent } from './actions-create/actions-create.component';
import { GlobalService } from 'src/app/global/app.global.service';
import swal from 'sweetalert2';
import { EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  filterBy: string = '';
  modalRef: BsModalRef;
  allCatogeries: any[] = [];
  allActions:any[] = [];
  actionsDict:any = {};
  allCatogeriesActions = [];
  modalType: string = 'NEW';
  searchText: string = '';
  ActionPriorities = [];
  AllGoals = [];
  Allobjectives = [];
  miscellaneousCatogeryID = "";
  constructor(private modalService: BsModalService, private enterpriseService:EnterpriseService, private globals:GlobalService) { 

    this.enterpriseService.getpriorities(this.globals.currentEnterpriseId).subscribe((result)=>{
      if (result.status == Constants.HTTP_STATUS_OK){
        this.ActionPriorities = result.body;
        console.log("Priorities...");
        console.log(result.body);
      }else{

      }
    },(error)=>{
      console.log("Get Priorities error....");

    });

    this.enterpriseService.getAllGoals(this.globals.currentEnterpriseId,1,1000,'goal_title','asc',this.globals.currentUserId).subscribe((result)=>{
      console.log("Get all Goals...");
      console.log(result);
      if(result.status == Constants.HTTP_STATUS_OK){
        this.AllGoals = result.body;
      }else{

      }

    },(error)=>{
        console.log("Get All Goals error....");
    });

    this.enterpriseService.TogetAllObjectivesService(this.globals.currentEnterpriseId,this.globals.currentUserId, 1,1000,'objective','asc').subscribe((result)=>{
      console.log("Get all Objectives...");
      console.log(result);
      if(result.status == Constants.HTTP_STATUS_OK){
        this.Allobjectives = result.body;
      }else{

      }

    },(error)=>{
        console.log("Get All Objectives error....");
    })
  }

  ngOnInit() {

    this.getCategoriesforActions();
  }

  getCategoriesforActions(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getCategories(this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (result) => {
        console.log(result.body);
          if (result.status == Constants.HTTP_STATUS_OK) {
           // this.allCatogeriesActions['color'] = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," +  
            // Math.floor(Math.random() * 255) + ")";  
            this.allCatogeries = result.body;
            this.allCatogeriesActions = result.body;
            for(let i=0;i<this.allCatogeries.length;i++){
              if(this.allCatogeries[i].name == "Miscellaneous"){
                this.miscellaneousCatogeryID = this.allCatogeries[i].category_id;
              }
            }
            this.getActionsUsingCategoryIDs();
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


  async getActionsUsingCategoryIDs(){

   for(let i=0;i<this.allCatogeries.length;i++){
      await this.enterpriseService.getActions(this.globals.currentEnterpriseId,this.globals.currentUserId,this.allCatogeries[i].category_id).subscribe(
      (result) => {              
          if (result.status == Constants.HTTP_STATUS_OK) {
          //  console.log(result.body);
           this.allActions.push(result.body);
           this.allCatogeriesActions[i]['actions'] = result.body; 
          }else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) { 
            this.allActions.push([]);
            this.allCatogeriesActions[i]['actions'] = []; 
          }else { 
            this.allActions.push([]);
            this.allCatogeriesActions[i]['actions'] = []; 
          }   
      },(err)=>{
        //this.globals.hideLoading('Please wait');
      }
      );
      if(i == this.allCatogeries.length -1){
        this.globals.hideLoading('Please wait'); 
        console.log('All catogery Actions');
        console.log(this.allCatogeriesActions);
      }
   }
  

  }

  refreshPageData() {
    /* Page refresh method will be called here */
  }

  refreshSearch(){

  }
  public auctiondata= ['1','2','3','4','5','6']
  getSearchDetailsFromServer(){

  }



  openActionsModal(type,input) {
    console.log("Clicked objective modal");
    const initialState = {
      modalType: type,
      modalData: input,
      modalActions: this.ActionPriorities,
      modalCatogeries: this.allCatogeries,
      modalGoals:this.AllGoals,
      modalObjectives:this.Allobjectives,
      miscellaneousCatogeryID : this.miscellaneousCatogeryID
    };
    this.modalRef = this.modalService.show(ActionsCreateComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));

    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        /* Actions loading method should be called here */
        console.log("Actions create page loaded....");
      }
    });
  }

  // openObjectActivity(){
  //   const initialState = {
  //     modalType: this.modalType,
  //   };
  //   this.modalRef = this.modalService.show(ObjectivesActivityComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));
  //   this.modalRef.content.eventT.subscribe(data => {
  //     console.log('Child component\'s event was triggered', data);
  //     if(data == 'true'){
  //         /* Goals loading method should be called here */
  //     }
  //   });
  // }

  openDeleteConfirmDialog(){
   
    swal.fire({
      html:'<span style="font-size:large;">Are you sure to delete</span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
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
        
      }
    })
  }

}

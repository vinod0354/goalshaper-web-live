import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { DeleteModalComponent } from 'src/app/delete-modal/delete-modal.component';

@Component({
  selector: 'app-actions-create',
  templateUrl: './actions-create.component.html',
  styleUrls: ['./actions-create.component.css']
})
export class ActionsCreateComponent implements OnInit {

  public modalType;
  public modalData;
  public Title;
  public modalActions;
  public modalCatogeries;
  public modalGoals;
  public modalObjectives;
  public modalActionType;
  public miscellaneousCatogeryID;
  public quickAction;

  modalRef: BsModalRef;
  ButtonText:string = 'Save';
  targetMinDate = new Date();
  completedMinDate = new Date();
  scheduledMinDate = new Date();
  allMilestones = [];

  show_expander = true;

  goalTypes:any;
  professionalGoalId:any;
  personalGoalId:any;

  isEditable : boolean = false;
  isEdit = true;

  actions:any = {
    "action": "",
    "objective_id": null,
    "created_user_id":null,
    "scheduled_date": "",
    "completed_date": "",
    "target_date": "",
    "description": "null",
    "remarks": "null",
    "priority_id": null,
    "action_category_id": null,
    "enterprise_id": null,
    "goal_id": null,
    "milestone_id":null,
    "action_type": null
  };

  // actions:any = {
  //   "action": "null",
  //   "objective_id": null,
  //   "created_user_id":null,
  //   "scheduled_date": "null",
  //   "completed_date": "null",
  //   "target_date": "null",
  //   "description": "null",
  //   "remarks": "null",
  //   "priority_id": null,
  //   "action_category_id": null,
  //   "enterprise_id": null,
  //   "goal_id": null
  // };
  
  visible = false;
  public eventT: EventEmitter<any> = new EventEmitter();
  constructor(private datapipe:DatePipe, private globals:GlobalService,private enterpriseService:EnterpriseService,public bsModalRef: BsModalRef, private modalService: BsModalService) { 

    // this.enterpriseService.getMilestones(this.globals.currentEnterpriseId, this.modalData.goal_id).subscribe((result) => {
    //   if (result.status == 200) {
    //     this.allMilestones = result.body;
    //   }else{
    //     console.log("Get Milestone error...");
    //   }},(error)=>{
    //     console.log("Get Milestone error...");
    //   });


  }

  ngOnInit() {
    this.show_expander = true;
    console.log("Received Data : ");
    console.log(this.modalData);
    console.log(this.Title);
    console.log('Modal Type');
    console.log(this.modalType)
    console.log(this.modalActions);
    console.log(this.modalCatogeries);
    console.log(this.modalGoals);
    console.log(this.modalActionType);
    console.log(this.modalObjectives);
    console.log(this.miscellaneousCatogeryID);
    console.log();
    // this.getGoalTypes();
    
    if(this.modalData.goal_id){
      this.enterpriseService.getMilestones(this.globals.currentEnterpriseId, this.modalData.goal_id).subscribe((result) => {
        if (result.status == 200) {
          this.allMilestones = result.body;
          console.log(this.allMilestones);
        }else{
          console.log("Get Milestone error...");
        }},(error)=>{
          console.log("Get Milestone error...");
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        });
  
    }

    if (this.modalType == 'create') {
      this.modalData = {
        "action": '',
        "objective_id": "",
        "created_user_id":this.globals.currentUserId,
        "scheduled_date": "",
        "completed_date": "",
        "target_date": "",
        "description": "",
        "remarks": "",
        "priority_id": this.modalActions[2].priority_id,
        "action_category_id": "",
        "enterprise_id": this.globals.currentEnterpriseId,
        "goal_id": "",
        "milestone_id":"",
        "action_type": this.modalActionType[0].goal_type_id
      };
      this.actions = {
        "action": this.Title,
        "objective_id": "",
        "created_user_id":this.globals.currentUserId,
        "scheduled_date": "",
        "completed_date": "",
        "target_date": "",
        "description": "",
        "remarks": "",
        "priority_id": this.modalActions[2].priority_id,
        "action_category_id": "",
        "enterprise_id": this.globals.currentEnterpriseId,
        "goal_id": "",
        "milestone_id":"",
        "action_type": this.modalActionType[0].goal_type_id
      };

    } else if(this.modalType == 'sortplus'){
        console.log("sortplus",this.modalData)
     
      let category_id:any;
      if(this.modalData.actions.length>0){
        category_id = this.modalData.actions[0].action_category_id;
      } else{
        category_id = this.modalData.category_id;
      }

      this.modalData = {
        "action": this.modalData.action,
        "objective_id": "",
        "created_user_id":this.globals.currentUserId,
        "scheduled_date": "",
        "completed_date": "",
        "target_date": "",
        "description": "",
        "remarks": "",
        "priority_id": this.modalActions[2].priority_id,
        "action_category_id": category_id ? category_id : "",
        "enterprise_id": this.globals.currentEnterpriseId,
        "goal_id": "",
        "milestone_id":"",
        "action_type": this.modalActionType[0].goal_type_id,
      };


      this.actions = {
        "action": this.Title,
        "objective_id": "",
        "created_user_id":this.globals.currentUserId,
        "scheduled_date": "",
        "completed_date": "",
        "target_date": "",
        "description": "",
        "remarks": "",
        "priority_id": this.modalActions[2].priority_id,
        "action_category_id": category_id ? category_id : "",
        "enterprise_id": this.globals.currentEnterpriseId,
        "goal_id": "",
        "milestone_id":"",
        "action_type": this.modalActionType[0].goal_type_id
      };

    } else{

      // if(this.modalType == 'find'){
      //   this.show_expander = false;
      // }

      console.log((!this.modalData.scheduled_date.includes('1900')));
      console.log(!(this.modalData.completed_date.includes('1900')));
      console.log((!this.modalData.target_date.includes('1900')));
      this.actions = {
        "action": this.modalData.action,
        "objective_id": this.modalData.objective_id ? this.modalData.objective_id : "",
        "created_user_id":this.modalData.created_user_id,
        "scheduled_date": (this.modalData.scheduled_date) && (!this.modalData.scheduled_date.includes('1900')) ? this.modalData.scheduled_date : "",
        "completed_date": this.modalData.completed_date  && (!this.modalData.completed_date.includes('1900') ) ? this.modalData.completed_date : "",
        "target_date": this.modalData.target_date  && (!this.modalData.target_date.includes('1900')) ? this.modalData.target_date : "",
        "description": this.modalData.description,
        "remarks": this.modalData.remarks,
        "priority_id": this.modalData.priority_id,
        "action_category_id": this.modalData.action_category_id ? this.modalData.action_category_id : "",
        "enterprise_id": this.modalData.enterprise_id,
        "goal_id": this.modalData.goal_id ? this.modalData.goal_id  : "",
        "milestone_id":this.modalData.milestone_id ? this.modalData.milestone_id : "",
        "action_type": this.modalData.action_type,
      };

      // if(this.modalType == 'find'){
      //   this.actions.action_category_id = "";
      // }
    }
    console.log("Actions");
    console.log(this.actions);
  }

  closeModal(){
    this.bsModalRef.hide();
  }

  onEdit(){
    this.isEditable = !this.isEditable;
    this.isEdit = !this.isEdit
  }

  onBlur(event){
    this.isEdit = !this.isEdit;
    this.isEditable = !this.isEditable;
  }

  saveActions(){

    if((this.actions.action_category_id == ""  || this.actions.action_category_id == this.miscellaneousCatogeryID)  && this.actions.target_date!="" ){
      this.sweetAlertDisplay('Please, Select category.',false);
      return;
    }

    let action_id = "null";
    this.globals.showLoading('Please wait');
    console.log("Save actions clicked....");
    if(this.modalType == 'create'){

     // if(!this.visible){

        console.log("Miscellaneous....only action short");
        this.actions = {
          "action": this.actions.action ? this.actions.action : "",
          "objective_id": "null",
          "created_user_id":this.globals.currentUserId,
          "scheduled_date": this.actions.scheduled_date ? this.datapipe.transform(this.actions.scheduled_date, 'yyyy-MM-dd hh:mm:ss') : "" ,
          "completed_date": this.actions.completed_date ? this.datapipe.transform(this.actions.completed_date, 'yyyy-MM-dd hh:mm:ss') : "",
          "target_date": this.actions.target_date ? this.datapipe.transform(this.actions.target_date, 'yyyy-MM-dd hh:mm:ss') : "",
          "description": "",
          "remarks": "null",
          "priority_id": this.actions.priority_id ? this.actions.priority_id : this.modalActions[2].priority_id,
          "action_category_id": this.actions.action_category_id ? this.actions.action_category_id : (this.miscellaneousCatogeryID ? this.miscellaneousCatogeryID : "null"),
          "enterprise_id": this.globals.currentEnterpriseId,
          "goal_id": this.actions.goal_id ? this.actions.goal_id : "null",
          "milestone_id":this.actions.milestone_id ? this.actions.milestone_id : "null",
          "action_type":this.actions.action_type ? this.actions.action_type : this.modalActionType[0].goal_type_id
        };

     // } else{

        console.log("Miscellaneous....only action full",      this.actions);
        
        // this.actions.priority_id = this.actions.priority_id ? this.actions.priority_id : this.modalActions[2].priority_id;
        // this.actions.goal_id = this.actions.goal_id ? this.actions.goal_id : "null";
        // this.actions.milestone_id = this.actions.milestone_id ? this.actions.milestone_id : "null";
        // this.actions.enterprise_id = this.globals.currentEnterpriseId;
        // this.actions.scheduled_date = this.actions.scheduled_date ? this.datapipe.transform(this.actions.scheduled_date, 'yyyy-MM-dd hh:mm:ss') : ""; //this.actions.scheduled_date  ? new Date(this.actions.scheduled_date).toUTCString() : "null";
        // this.actions.completed_date = this.actions.completed_date ? this.datapipe.transform(this.actions.completed_date, 'yyyy-MM-dd hh:mm:ss') : "";   //this.actions.completed_date  ? new Date(this.actions.completed_date).toUTCString() : "null";
        // this.actions.target_date = this.actions.target_date ? this.datapipe.transform(this.actions.target_date, 'yyyy-MM-dd hh:mm:ss') : "";  //this.actions.target_date ? new Date(this.actions.target_date).toUTCString() : "null";
        // this.actions.objective_id = this.actions.objective_id ? this.actions.objective_id : 'null';
        // this.actions.action_category_id = this.actions.action_category_id ? this.actions.action_category_id : (this.miscellaneousCatogeryID ? this.miscellaneousCatogeryID : "null");
        // this.actions.action_type = this.actions.action_type ? this.actions.action_type : this.modalActionType[0].goal_type_id;
        //this.datepipe.transform(this.ObjectiveInfo.scheduledDate, 'yyyy-MM-dd hh:mm:ss hh:mm:ss')
     // }

     

    }
     else if(this.modalType == 'sortplus'){

      this.actions.priority_id = this.actions.priority_id ? this.actions.priority_id : this.modalActions[2].priority_id;
      this.actions.goal_id = this.actions.goal_id ? this.actions.goal_id : "null";
      this.actions.milestone_id = this.actions.milestone_id ? this.actions.milestone_id : "null";
      this.actions.enterprise_id = this.globals.currentEnterpriseId;
      this.actions.scheduled_date = this.actions.scheduled_date ? this.datapipe.transform(this.actions.scheduled_date, 'yyyy-MM-dd hh:mm:ss') : ""; //this.actions.scheduled_date  ? new Date(this.actions.scheduled_date).toUTCString() : "null";
      this.actions.completed_date = this.actions.completed_date ? this.datapipe.transform(this.actions.completed_date, 'yyyy-MM-dd hh:mm:ss') : "";   //this.actions.completed_date  ? new Date(this.actions.completed_date).toUTCString() : "null";
      this.actions.target_date = this.actions.target_date ? this.datapipe.transform(this.actions.target_date, 'yyyy-MM-dd hh:mm:ss') : "";  //this.actions.target_date ? new Date(this.actions.target_date).toUTCString() : "null";
      this.actions.objective_id = this.actions.objective_id ? this.actions.objective_id : 'null';
      this.actions.action_category_id = this.actions.action_category_id ? this.actions.action_category_id : (this.miscellaneousCatogeryID ? this.miscellaneousCatogeryID : "null");
      this.actions.action_type = this.actions.action_type ? this.actions.action_type : this.modalActionType[0].goal_type_id;
      //this.datepipe.transform(this.ObjectiveInfo.scheduledDate, 'yyyy-MM-dd hh:mm:ss hh:mm:ss')


     }
     else{


      console.log('Editing existing action');
      this.actions = {
        "action":this.actions.action ? this.actions.action : "",
        "objective_id": this.actions.objective_id ?  this.actions.objective_id :"null",
        "created_user_id":this.globals.currentUserId,
        "scheduled_date": this.actions.scheduled_date ? this.datapipe.transform(this.actions.scheduled_date, 'yyyy-MM-dd hh:mm:ss') :  "",
        "completed_date": this.actions.completed_date ? this.datapipe.transform(this.actions.completed_date, 'yyyy-MM-dd hh:mm:ss') : "",
        "target_date": this.actions.target_date ? this.datapipe.transform(this.actions.target_date, 'yyyy-MM-dd hh:mm:ss') : "",
        "description": this.actions.description ? this.actions.description: "",
        "remarks": this.actions.remarks ? this.actions.remarks : "null",
        "priority_id": this.actions.priority_id ?this.actions.priority_id :"null",
        "action_category_id": this.actions.action_category_id  ? this.actions.action_category_id : "null",
        "enterprise_id": this.globals.currentEnterpriseId,
        "goal_id": this.actions.goal_id ? this.actions.goal_id : "null",
        "milestone_id" : this.actions.milestone_id ? this.actions.milestone_id : "null",
        "action_type" : this.actions.action_type ? this.actions.action_type : "null"
      };

      

    }
    console.log(this.actions);

    
    if(this.modalType == 'create' || this.modalType == 'sortplus'){
    this.enterpriseService.createAction(this.actions).subscribe((result)=>{
      console.log('Action creation is successful');
      console.log(result);
      this.globals.hideLoading('Please wait');
      if(result.status ==200){
        this.eventT.emit('true');
        this.bsModalRef.hide();
      }else{
        this.sweetAlertDisplay("Action Creation failed, Try Again", false);
      }
      

    },(error)=>{
      console.log('Action creation Failed.');
      console.log(error);
      this.globals.hideLoading('Please wait');
      this.sweetAlertDisplay("Action Creation failed, Try Again", false);

    });

    } else{

      this.enterpriseService.updateAction(this.modalData.action_id, this.actions).subscribe((result)=>{
        console.log('Action Update is successful');
        console.log(result);
        this.globals.hideLoading('Please wait');
        if(result.status ==200){
          this.eventT.emit('true');
              this.bsModalRef.hide();
          //this.sweetAlertDisplay("Action Updated successfully", true);
        }else{
          this.sweetAlertDisplay("Action Update failed, Try Again", false);
        }
        
  
      },(error)=>{
        console.log('Action creation Failed.');
        console.log(error);
        this.globals.hideLoading('Please wait');
        this.sweetAlertDisplay("Action Update failed, Try Again", false);
  
      });

    }
  }

  getGoalTypes(){
    this.enterpriseService.getGoalTypes(this.globals.currentEnterpriseId).subscribe((result) => {
      this.goalTypes = result.body
      console.log("goalType",result)
      // result.body.filter(X=>{
      //   if(X=>X.type_name == "Professional"){
      //       this.professionalGoalId = X.goal_type_id
      //     }else{
      //       this.personalGoalId = X.goal_type_id
      //     }
      //   }
      // )
    },err =>{
      console.log(err);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
  }

  openDeleteModal() {
    let initialState = {
			modalData: this.modalData
		}
    this.modalRef = this.modalService.show(
			DeleteModalComponent,
			Object.assign({ initialState },{ class: 'gray modal-md' })
    );
    this.bsModalRef.hide(); 
   
    
   
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
          this.eventT.emit('true');
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
  

  openDeleteConfirmDialog() {
		swal
			.fire({
				html:
					'<span style="font-size:large;">Are you sure to delete</span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				imageUrl: 'assets/img/Question-48.png',
				iconHtml: '<img src="assets/img/Question-48.png" style="width:45px; height:45px;"/>',
				allowOutsideClick: false,
				showClass: {
					popup: 'animated fadeInDown faster'
				},
				hideClass: {
					popup: 'animated fadeOutUp faster'
				},
				allowEscapeKey: false
			})
			.then((result) => {
				if (result.value) {
          console.log("Delete action command fired....");
          console.log();
          this.enterpriseService.deleteAction(this.globals.currentEnterpriseId,this.modalData.action_id).subscribe((result)=>{
            console.log(result);
            if(result.status == 200){
              console.log(result);
              this.eventT.emit('true');
              this.bsModalRef.hide();
            //  this.sweetAlertDisplay("Action Deleted successfully", true);
              
            }else{
              console.log("Delete Api server error.");
              this.sweetAlertDisplay("Action Deleted failed", true);
            }
          },(error)=>{
            console.log(error);
            this.globals.showErrorMessage('Something went wrong. Please try later!');
          });
				}
			});
  }


  onChangeGoals(event){
    console.log("Select Event triggered");
    this.globals.showLoading('Please wait....');
    console.log(event);
    console.log(event.target.value);
    this.actions.goal_id = event.target.value;
    if(event.target.value){
      this.enterpriseService.getMilestones(this.globals.currentEnterpriseId, event.target.value).subscribe((result) => {
        if (result.status == 200) {
          this.allMilestones = result.body;
          console.log(this.allMilestones);
          this.globals.hideLoading('Please wait....');
        }else{
          console.log("Get Milestone error...");
          this.allMilestones =[];
          this.globals.hideLoading('Please wait....');
        }},(error)=>{
          console.log("Get Milestone error...");
          this.allMilestones = [];
          this.globals.hideLoading('Please wait....');
        });
  
    }
     
  }

  onChangeMileStones(event){
    // this.actions.goal_id = event.target.value;
    //as of now do nothing.

  }

  onChangeObjectives(event){
    this.actions.objective_id = event.target.value;
    console.log('Objective Changed');
    console.log(this.actions.objective_id);
  }

  onChangePriority(event){
    this.actions.priority_id = event.target.value;
    console.log('Priority Changed.');
    console.log(this.actions.priority_id);
  }

  onChangeCategory(event){
    if(event.target.value == ""){
      this.actions.action_category_id = this.miscellaneousCatogeryID;
    }else{
      this.actions.action_category_id = event.target.value;
    }
    
    console.log('Change category');
    console.log(this.actions.action_category_id);
  }

  onChangeActiontype(event){
    this.actions.action_type = event.target.value
    console.log(this.actions.action_type);
  }

  markActionDone(){
    this.actions.completed_date = moment();
    if(!this.actions.target_date){
      this.actions.target_date = moment();
    }
    this.globals.showLoading('Please wait');
    this.enterpriseService.updateAction(this.modalData.action_id, this.actions).subscribe((result)=>{
      console.log('Action Update is successful');
      console.log(result);
      this.globals.hideLoading('Please wait');
      if(result.status ==200){
        this.eventT.emit('true');
        this.bsModalRef.hide();
        //this.sweetAlertDisplay("Action Updated successfully", true);
      }else{
        this.sweetAlertDisplay("Action Update failed, Try Again", false);
      }
    },(error)=>{
      console.log('Action creation Failed.');
      console.log(error);
      this.globals.hideLoading('Please wait');
      this.sweetAlertDisplay("Action Update failed, Try Again", false);

    });

  }

  markUnDone(){
    this.actions.completed_date = "";
    this.globals.showLoading('Please wait');
    this.enterpriseService.updateAction(this.modalData.action_id, this.actions).subscribe((result)=>{
      console.log('Action Update is successful');
      console.log(result);
      this.globals.hideLoading('Please wait');
      if(result.status ==200){
        this.eventT.emit('true');
        this.bsModalRef.hide();
       // this.sweetAlertDisplay("Action Updated successfully", true);
      }else{
        this.sweetAlertDisplay("Action Update failed, Try Again", false);
      }
    },(error)=>{
      console.log('Action creation Failed.');
      console.log(error);
      this.globals.hideLoading('Please wait');
      this.sweetAlertDisplay("Action Update failed, Try Again", false);

    });

  }

}

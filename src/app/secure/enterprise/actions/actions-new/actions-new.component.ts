import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/global/app.global.service';
import swal from 'sweetalert2';
import { EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { ActionsCreateComponent } from '../actions-create/actions-create.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { stringify } from 'querystring';
import { filter } from 'rxjs/operators';
import moment from 'moment';
import { AddDateComponent } from '../add-date/add-date.component';
import { ShareComponent } from '../../progress-tracker/share/share.component';
import { EventBrokerService } from 'ng-event-broker';
import { Help } from 'src/app/events.model';
import { ActionHelpComponent } from '../action-help/action-help.component';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { Subscription } from 'rxjs';
mobiscroll.settings = {
	theme: 'ios',
	themeVariant: 'light'
};
const now = new Date();
@Component({
	selector: 'app-actions-new',
	templateUrl: './actions-new.component.html',
	styleUrls: [ './actions-new.component.css' ]
})
export class ActionsNewComponent implements OnInit {
	displayIfNoCategories = false;
	filterBy: string = 'action';
	modalRef: BsModalRef;
	allCatogeries: any[] = [];
	allActions: any[] = [];
	actionsDict: any = {};
	allCatogeriesActions = [];
	modalType: string = 'NEW';
	searchText: string = '';
	ActionPriorities = [];
	AllGoals = [];
	Allobjectives = [];
	miscellaneousCatogeryID = '';
	click_previous_index = 0;
	chunk_open_header = 0;

	quickActionName = '';
	quickActionDo =''
	public sortTitle: string[] = [];

	calender_below_overdue = true;
	calender_below_today = true;
	calender_below_thisweek = false;
	calender_below_beyond = false;

	collapse_all = true;

	dumpActions = [];
	chunkActions = [];
	doActions = [];
	dueActions = [];
	weekActions = []
	overdueActionList = [];
	todayActionList = [];
	actionList=[];
	thisWeekActionList = [];
	beyondList = [];
	searchBy: any;
	chunkCount = 0;
	chunkTotalcount = this.chunkCount.toString().padStart(2, '0');
	catogeryNames = [];
	catogeryNames_1= ['moviesList'];
	visible = false;
	sortvisible = false;
	markedDay: Date;
	markedDays = [];
	markedDays_strings = [];

	days = [];
	daysRequired = 6;
	otherDate:any;
	collapseFlag= true
	tab = 'do'
	selectedDate:any;
	selectedWeekList =[]
	title= "Collapse All"
	goalTypes:any;
	professionalGoalId:any;
	personalGoalId:any;
	deleteSubscription:Subscription;
	actionHelpSubscription:Subscription;

	FindHelp = true;
	SortHelp = false;
	DoHelp = false;

	public eventT: EventEmitter<any> = new EventEmitter();
	
	constructor( private modalService: BsModalService, private enterpriseService: EnterpriseService, private globals: GlobalService, private datapipe:DatePipe,
		 private eventService: EventBrokerService,public pubsubSvc: NgxPubSubService) {
		this.countChunks();
	}

	ngOnDestroy(): void {
	this.deleteSubscription.unsubscribe()
	this.actionHelpSubscription.unsubscribe()
	}

	ngOnInit() {
		this.getCategoriesforActions();
		this.getGoalTypes();
		// this.eventService.subscribeEvent(Help.ActionHelp).subscribe(() => this.openHelp());
		
		this.otherDate = {
			displayDate : 'Another Date',
			actions:[],
			id:"anotherDate",
			visible:false
					
		}
		
		this.deleteSubscription = this.pubsubSvc.subscribe('deleted', (data: any) => { 
			this.getCategoriesforActions();
		})

		this.actionHelpSubscription = this.pubsubSvc.subscribe('ActionHelp', (data: any) => { 
			if(this.FindHelp == true){
				this.openHelp('find')
			}else if(this.SortHelp == true){
				this.openHelp('sort')
			}else if(this.DoHelp == true){
				this.openHelp('do')
			}
		})
	}

	findTab(){
		this.FindHelp = true;
		this.SortHelp = false;
		this.DoHelp = false;
	}

	sortTab(){
		this.FindHelp = false;
		this.SortHelp = true;
		this.DoHelp = false;
	}

	//Share
	openShare() {
		let arr = [...this.todayActionList,...this.overdueActionList]
		let initialState ={
			modalData : arr
		}
		this.modalRef = this.modalService.show(
			ShareComponent,
			Object.assign({initialState},{ class: 'gray modal-md' })
		);
		this.modalRef.content.shareT.subscribe((data) => {
			console.log("Child component's event was triggered", data);
			if (data == 'print') {
				setTimeout(()=>{ window.print()}, 1000)
				
			}
		});
	}

	//Share
	openHelp(type) {
		const initialState = {
			modalType: type,
		};
		this.modalRef = this.modalService.show(
			ActionHelpComponent,
			Object.assign({ initialState },{ class: 'gray modal-md' })
		);
	}

	//Get All Categories
	getCategoriesforActions() {
		this.catogeryNames = [];
		this.catogeryNames_1= ['moviesList'];
		this.allCatogeriesActions = [];
		this.allCatogeries = [];
		this.globals.showLoading('Please wait');
		this.enterpriseService.getCategories(this.globals.currentEnterpriseId, this.globals.currentUserId).subscribe(
			(result) => {
				console.log(result.body);
				if (result.status == Constants.HTTP_STATUS_OK) {
					console.log("******************** Catogeries*************");
					console.log(result.body);
					for(let i=0;i<result.body.length;i++){
						if(result.body[i].name.toLowerCase().indexOf("category") == -1){
							this.allCatogeries.push(result.body[i]);
						}
						if(i == result.body.length-1){
							this.allCatogeriesActions = this.allCatogeries;
							for (let i = 0; i < this.allCatogeries.length; i++) {
								if (this.allCatogeries[i].name == 'Miscellaneous') {
									this.miscellaneousCatogeryID = this.allCatogeries[i].category_id;
								}
							}
							this.getActionsUsingCategoryIDs();
						}
					}
					// this.allCatogeries = result.body;
					// this.allCatogeriesActions = result.body;

				} else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
					this.globals.hideLoading('Please wait');
				} else {
					this.globals.hideLoading('Please wait');
				}
			},
			(err) => {
				this.globals.hideLoading('Please wait');
			}
		);
	}

	//Get All Actions based on categories.
	async getActionsUsingCategoryIDs() {
		let apiCallingCount = 0;
		for (let i = 0; i < this.allCatogeries.length; i++) {
			await this.enterpriseService
				.getActions(
					this.globals.currentEnterpriseId,
					this.globals.currentUserId,
					this.allCatogeries[i].category_id
				)
				.subscribe(
					(result) => {
						apiCallingCount++;
						if (result.status == Constants.HTTP_STATUS_OK) {
							console.log('Actions for each category');
							console.log('i Value : ' + i);
							console.log(result.body);
							this.allCatogeriesActions[i]['actions'] = result.body;
						} else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
							// this.allActions.push([]);
							this.allCatogeriesActions[i]['actions'] = [];
						} else {
							// this.allActions.push([]);
							this.allCatogeriesActions[i]['actions'] = [];
						}
						this.countChunks();

						if (apiCallingCount == this.allCatogeries.length) {
							console.log('Final call can be Done here.');
							console.log('All Categories.');
							console.log(this.allCatogeries);
							console.log('All Categories with actions.');
							console.log(this.allCatogeriesActions);
							this.processData();
						}
					},
					(err) => {
						apiCallingCount++;
					}
				);
		}
	}

	//Get GoalType
	getGoalTypes(){
		this.enterpriseService.getGoalTypes(this.globals.currentEnterpriseId).subscribe((result) => {
		  this.goalTypes = result.body
		  console.log("goalType",result)
		  result.body.filter(X=>{
		    if(X=>X.type_name == "Professional"){
				this.professionalGoalId = X.goal_type_id,
				console.log(this.professionalGoalId);
		      }else{
		        this.personalGoalId = X.goal_type_id
		      }
		    }
		  )
		},err =>{
		  console.log(err);
		  this.globals.showErrorMessage('Something went wrong. Please try later!');
		})
	  }

	//Sort Count
	countChunks() {
		console.log('Chunks count is called.... ');
		this.chunkCount = 0;

		if(this.chunkActions.length == 0){
			this.chunkCount = 0;
			this.chunkTotalcount = this.chunkCount.toString().padStart(2, '0');
			console.log(this.chunkCount);
		}
		for (let i = 0; i < this.chunkActions.length; i++) {
			this.chunkCount = this.chunkCount + this.chunkActions[i].actions.length;
			if (i == this.chunkActions.length - 1) {
				console.log('Chunk count....');
				this.chunkTotalcount = this.chunkCount.toString().padStart(2, '0');
				console.log(this.chunkCount);
			}
		}
	}

	//Refresh page Data
	refreshPageData() {
		/* Page refresh method will be called here */
		console.log("Refresh Actions Page");
		this.getCategoriesforActions();
	}

	//Refresh
	refreshSearch() {
		console.log("Refresh search triggered...");
		this.searchBy = this.getSearchObject();
		console.log(this.searchBy);
		this.countChunks();
	}

	//Search function
	getSearchObject() {
		let searchObj = {};
			if (this.filterBy == '') {
				searchObj['action'] = this.searchText;
			}else{
				searchObj['action'] = this.searchText;
			}

		return searchObj;
	}

	public auctiondata = [ '1', '2', '3', '4', '5', '6' ];
	getSearchDetailsFromServer() {}
	
	//Open Action Modak
	openActionsModal(type, input,index?) {
		console.log("index",index)
		console.log(input);
		console.log('Clicked objective modal');
		let Categories_duplicate = [];
		console.log(this.allCatogeries);
		for(let i=0;i<this.allCatogeries.length;i++){
			if(this.allCatogeries[i].name != 'Miscellaneous'){
			  Categories_duplicate.push(this.allCatogeries[i]);
			}

			if(i == this.allCatogeries.length-1){

				for(let j=0;j<Categories_duplicate.length;j++){
					if(Categories_duplicate[j].category_id == input.category_id){
						console.log('&&&&&&&&&&& Matched &&&&&&');
						console.log(j);
						this.chunk_open_header = j;
					}
				}

			}
			
		  }

		let initialState = {
			modalType: type,
			modalData: input,
			modalActions: this.ActionPriorities,
			modalCatogeries: Categories_duplicate,
			modalGoals: this.AllGoals,
			modalObjectives: this.Allobjectives,
			modalActionType: this.goalTypes,
			miscellaneousCatogeryID: this.miscellaneousCatogeryID,
			Title: this.sortTitle[index] 
		};
		if(type == 'create'){
			initialState.Title =input ;
			initialState.modalData ={};
		}
		this.modalRef = this.modalService.show(
			ActionsCreateComponent,
			Object.assign({ initialState }, { class: 'gray modal-lg' })
		);

		this.modalRef.content.eventT.subscribe((data) => {
			console.log("Child component's event was triggered", data);
			if (data == 'true') {
				
				if(index){
				this.sortTitle[index] = ""
				}
				this.quickActionDo = ""
				/* Actions loading method should be called here */
				console.log('Actions create page loaded....');
				this.getCategoriesforActions();
			}
		});
		this.sortTitle[index] = ""
		this.quickActionDo = ""
	}

	//Alert on Delete
	openDeleteConfirmDialog(action) {
		swal.fire({
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
				this.enterpriseService.deleteAction(this.globals.currentEnterpriseId,action.action_id).subscribe((result)=>{
				console.log(result);
					if(result.status == 200){
						console.log(result);
						this.sweetAlertDisplay("Action Deleted successfully", true);
						this.getCategoriesforActions();
					}else{
						console.log("Delete Api server error.");
						this.sweetAlertDisplay("Action Deleted failed", true);
					}
				},(error)=>{
					console.log(error);
				});
			}
		});
  	}
	
	clear(index){
		this.sortTitle[index] = null;
	}

	//Alert Popup
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
			//this.getCategoriesforActions();
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

	//Date Click on Calendar
	getDetailsofClick(data) {
		console.log(data);
		this.processCalenderEvents(data.valueText);
		console.log(new Date(data.valueText));
	}



	// a and b are javascript Date objects
	dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}

	//Sort Click header
	clickheader(data, src) {
		if(src == 'find') {
			this.chunkActions[data].visible = !this.chunkActions[data].visible;
		} else if(src == 'sort') {
			this.chunkActions[data].sortvisible = !this.chunkActions[data].sortvisible;
		} else {
			this.chunkActions.forEach(element => {
				element.sortvisible = false;
			});
		}
		
		console.log('***************************************');
		console.log(data);
		console.log(this.chunkActions[data]);
		this.chunk_open_header = data;
		// console.log('Header clicked');
		// console.log(data);

		// if(data != this.click_previous_index){
		//   this.chunkActions[data].visible = true;
		//   this.chunkActions[this.click_previous_index].visible = false;
		// }else{
		//   this.chunkActions[data].visible = !this.chunkActions[data].visible ;
		// }
		// this.click_previous_index = data;
	}

	//Drop on Sort
	onDrop(event: CdkDragDrop<string[]>) {
		console.log('Event Triggered....');
		console.log(event);
		// if (this.dumpActions == 0) {

		// }
		if(event.previousContainer.id == 'moviesList' && event.container.id== 'chooseDate'){
			return
		}
		if( event.previousContainer.id.includes('chooseDate') || event.previousContainer.id.includes('anotherDate')){
			return
		}
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			console.log('SAME container......');
		}else if(event.previousContainer.id == 'moviesList'){
			let substract_index = 0;
			if(event.currentIndex == 0){
				substract_index = 0;
			}else if(event.currentIndex == 1){
				substract_index = 1;
			}else{
				substract_index = 2
			}
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex-substract_index
			);

    	console.log('other container......');
		console.log(this.chunkActions);
		console.log(this.dumpActions);
		console.log(event.currentIndex-substract_index);
		console.log(event.container.id);
		for(let i=0;i< this.chunkActions.length;i++){

			if(this.chunkActions[i].name == event.container.id){
			console.log('*********');
			console.log(i);
			console.log(this.chunkActions[i]);
			console.log(this.chunkActions[i].actions);
			console.log(this.chunkActions[i].actions[event.currentIndex-substract_index]);
			console.log(this.chunkActions[i].actions[event.currentIndex-substract_index]['action_category_id']);
			this.chunkActions[i].actions[event.currentIndex-substract_index]['action_category_id'] = this.chunkActions[i].category_id;
			this.chunkActions[i].actions[event.currentIndex-substract_index]['category_name'] = this.chunkActions[i].name;
			this.chunkActions[i].actions[event.currentIndex-substract_index]['color'] = this.chunkActions[i].color;
			this.updateOnDragDrop(this.chunkActions[i].actions[event.currentIndex-substract_index]);

			}
      	}
		this.countChunks();
		}
		else {
			
			let substract_index = 0;
			if(event.currentIndex == 0){
				substract_index = 0;
			}else if(event.currentIndex == 1){
				substract_index = 1;
			}else{
				substract_index = 2
			}
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex-2,
				event.currentIndex-substract_index
			);

    	console.log('other container......');
		console.log(this.chunkActions);
		console.log(this.dumpActions);
		console.log(event.currentIndex-substract_index);
		console.log(event.container.id);
		for(let i=0;i< this.chunkActions.length;i++){

			if(this.chunkActions[i].name == event.container.id){
			console.log('*********');
			console.log(i);
			console.log(this.chunkActions[i]);
			console.log(this.chunkActions[i].actions);
			console.log(this.chunkActions[i].actions[event.currentIndex-substract_index]);
			console.log(this.chunkActions[i].actions[event.currentIndex-substract_index]['action_category_id']);
			this.chunkActions[i].actions[event.currentIndex-substract_index]['action_category_id'] = this.chunkActions[i].category_id;
			this.chunkActions[i].actions[event.currentIndex-substract_index]['category_name'] = this.chunkActions[i].name;
			this.chunkActions[i].actions[event.currentIndex-substract_index]['color'] = this.chunkActions[i].color;
			this.updateOnDragDrop(this.chunkActions[i].actions[event.currentIndex-substract_index]);

			}
      	}
		this.countChunks();
		}
  	}
	
	//Drop on Find
	onDropFind(event: CdkDragDrop<string[]>) {
		console.log('Event Triggered....');
		console.log(event);
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			console.log('SAME container......');
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex-2,
				event.currentIndex
			);
		console.log('other container......');
		console.log(this.chunkActions);
		console.log(this.dumpActions);
		console.log(event.currentIndex);
		console.log(event.container.id);


		this.dumpActions[event.currentIndex-1]['action_category_id'] = this.miscellaneousCatogeryID;
		this.dumpActions[event.currentIndex-1]['category_name'] = 'Miscellaneous';
		this.updateOnDragDrop(this.dumpActions[event.currentIndex-1]);

		this.countChunks();

		}
	}

	//Drop on Date
	onDropDate(event: CdkDragDrop<string[]>,date){
		console.log('Event Triggered....');
		console.log(event);
		// if (this.dumpActions == 0) {

		// }
		if(event.previousContainer.id == 'moviesList' && event.container.id.includes('chooseDate')){
			return
		}
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			console.log('SAME container......');
		}else if(event.container.id.includes('chooseDate')) {

			// call update function here  with below parameters
			console.log(event.item.data); // item data
			let data:any = event.item.data;
			data.scheduled_date = date
			console.log(date) // date

			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex-2,
				event.currentIndex
			);

			this.updateOnDragDrop(data);
		}
	}

	//Drop on Date
	anotherDate(event: CdkDragDrop<string[]>,date){
		if(event.previousContainer.id == 'moviesList' && event.container.id == 'anotherDate'){
			return
		}
		if(event.previousContainer.id .includes('chooseDate') && event.container.id == 'anotherDate'){
			return
		}
		console.log('Event Triggered....');
		console.log(event.item.data);
		let initialState = {
			modalData: event.item.data
		}
		console.log("initialState",initialState);
		this.modalRef = this.modalService.show(
			AddDateComponent,
			Object.assign({ initialState },{ class: 'gray modal-md' })
		);
		// if (this.dumpActions == 0) {

		// }
		this.modalRef.content.addT.subscribe(data => {
			console.log('Child component\'s event was triggered', data);
			if (data == 'true') {
			  /* Actions loading method should be called here */
			  if (event.previousContainer === event.container) {
				moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
				console.log('SAME container......');
			}else if(event.container.id== 'anotherDate') {
	
				// call update function here  with below parameters
				console.log(event.item.data); // item data
	
				transferArrayItem(
					event.previousContainer.data,
					event.container.data,
					event.previousIndex,
					event.currentIndex
				);
	
				//this.modalRef = this.modalService.show(AddDateComponent, { class: 'gray modal-md' });
			}
			console.log("Actions create page loaded....");
			}
		});
	}

	//Update on Drag Drop
  	updateOnDragDrop(dataReceived){

		console.log("Data Received");
		console.log(dataReceived);

		let update_actions = {
			"action":dataReceived.action ? dataReceived.action : "",
			"objective_id": dataReceived.objective_id ?  dataReceived.objective_id :"null",
			"created_user_id":this.globals.currentUserId,
			"scheduled_date": dataReceived.scheduled_date ? this.datapipe.transform(dataReceived.scheduled_date, 'yyyy-MM-dd hh:mm:ss') :  "",
			"completed_date": dataReceived.completed_date ? this.datapipe.transform(dataReceived.completed_date, 'yyyy-MM-dd hh:mm:ss') : "",
			"target_date": dataReceived.target_date ? this.datapipe.transform(dataReceived.target_date, 'yyyy-MM-dd hh:mm:ss') : "",
			"description": dataReceived.description ? dataReceived.description: "",
			"remarks": dataReceived.remarks ? dataReceived.remarks : "null",
			"priority_id": dataReceived.priority_id ?dataReceived.priority_id :"null",
			"action_category_id": dataReceived.action_category_id  ? dataReceived.action_category_id : "null",
			"enterprise_id": this.globals.currentEnterpriseId,
			"goal_id": dataReceived.goal_id ? dataReceived.goal_id : "null",
			"milestone_id":dataReceived.milestone_id ? dataReceived.milestone_id : "null",
			"action_type":dataReceived.action_type ? dataReceived.action_type : "null",
		};

		console.log(update_actions);
		this.enterpriseService.updateAction(dataReceived.action_id,update_actions).subscribe((result)=>{
		console.log(result);
		if(result.status == 200){
			console.log("Succesfully updated.");
		}else{
			console.log('Api error');
		}
		},(error)=>{
			console.log(error);
		})
	}

	// Data for processing Display Actions into dump, chunk & do .
	processData() {
		this.days = []
		this.otherDate = {
			displayDate : 'Another Date',
						actions:[],
						id:"anotherDate",
						visible:false
					
		}
		for (let i = 0; i <= this.daysRequired; i++) {
			if (i == 0) {
				this.days.push( 
					{displayDate : 'Do Today',
						formatDate:moment().add(i, 'days').format('YYYY-MM-DD'),
						actions:[],
						id:"chooseDate"+i,
						visible:false
					}
				 );
			}else if(i == 1) {
				this.days.push(
					{displayDate : 'Tomorrow',
						formatDate:moment().add(i, 'days').format('YYYY-MM-DD'),
						actions:[],
						id:"chooseDate"+i,
						visible:false
					}
				);
			}else {
				this.days.push( 
					{displayDate : moment().add(i, 'days').format('dddd Do'),
						formatDate:moment().add(i, 'days').format('YYYY-MM-DD'),
						actions:[],
						id:"chooseDate"+i,
						visible:false
					}
				 );
			}
		
		}
		console.log("Data process Started....");
		this.chunkActions = [];
		this.dumpActions = [];
		this.doActions = [];
		for (let i = 0; i < this.allCatogeriesActions.length; i++) {
			for (let j = 0; j < this.allCatogeriesActions[i].actions.length; j++) {
				this.allActions.push(this.allCatogeriesActions[i].actions[j]);
			}
			if (this.allCatogeriesActions[i].name == 'Miscellaneous') {
				this.dumpActions = this.allCatogeriesActions[i].actions;
			} else {
				this.catogeryNames.push(this.allCatogeriesActions[i].name);
				this.catogeryNames_1.push(this.allCatogeriesActions[i].name);
				this.allCatogeriesActions[i]['visible'] = false;
        let chunkactionfilter = [];
        if(this.allCatogeriesActions[i].actions.length == 0){
          this.chunkActions.push(this.allCatogeriesActions[i]);
        }
				for (let h = 0; h < this.allCatogeriesActions[i].actions.length; h++) {
          console.log(this.allCatogeriesActions[i].actions[h]['target_date']);
          console.log('*************************');
		  console.log(this.allCatogeriesActions[i].actions[h]['target_date'].indexOf('1900'));
		  console.log("scheduled_date",this.allCatogeriesActions[i].actions[h]['scheduled_date'].indexOf('1900'));
		  
					if (
						this.allCatogeriesActions[i].actions[h]['scheduled_date'] == null ||
						this.allCatogeriesActions[i].actions[h]['scheduled_date'] == '' ||
						this.allCatogeriesActions[i].actions[h]['scheduled_date'].indexOf('1900') != -1 
						
					) {
						this.allCatogeriesActions[i].actions[h]['color'] = this.allCatogeriesActions[i].color;
						chunkactionfilter.push(this.allCatogeriesActions[i].actions[h]);
					} else {
						let assignitem = this.allCatogeriesActions[i].actions[h];
						assignitem['color'] = this.allCatogeriesActions[i].color;
						assignitem['name'] = this.allCatogeriesActions[i].name;
						console.log(assignitem)
						this.doActions.push(assignitem);
						
					}

					if (h == this.allCatogeriesActions[i].actions.length - 1) {
						this.countChunks();
						let dummy = this.allCatogeriesActions[i];
						dummy['actions'] = chunkactionfilter;
						this.chunkActions.push(dummy);
					}
				}
			}

			if (i == this.allCatogeriesActions.length - 1) {
				if(this.chunkActions.length > 0){
					this.displayIfNoCategories = false;
					this.chunkActions[this.chunk_open_header]['visible'] = true;
					this.chunkActions[this.chunk_open_header]['sortvisible'] = true;
				}else{
					this.displayIfNoCategories = true;
				}

				if(this.doActions.length > 0){
					for(let i=0;i<this.doActions.length;i++){
						for(let j=0;j<this.days.length;j++){
							// this.days[j].actions = []
							if(moment(this.doActions[i].scheduled_date).format('YYYY-MM-DD') == this.days[j].formatDate){
								this.days[j].actions .push(this.doActions[i])
							}
							if(moment(this.doActions[i].target_date).format('YYYY-MM-DD') == this.days[j].formatDate){
								this.dueActions.push(this.doActions[i])
							}

						}
					}
				}
				this.globals.hideLoading('Please wait');
				this.countChunks();
				console.log('Dump Actions');
				console.log(this.dumpActions);
				console.log('Chunk Actions');
				console.log(this.chunkActions);
				console.log('DO Actions');
				console.log(this.doActions);
				console.log("dueActions",this.dueActions)
				console.log("Chunk count");
				console.log(this.chunkCount);
				console.log('Catogery Names');
				console.log(this.catogeryNames);
				console.log(this.catogeryNames_1);
				this.processCalenderEvents(new Date());
				this.getCreatePageDropdownData();
			}
		}
	}

	// { d: new Date(now.getFullYear(), now.getMonth(), 2), color: '#46c4f3' }
	processCalenderEvents(datedata) {
		console.log("datedata",datedata)
		this.selectedDate = datedata
		this.overdueActionList = [];
		this.todayActionList = [];
		this.thisWeekActionList = [];
		this.beyondList = [];
		this.markedDays =[];
		this.markedDays_strings = [];
		let now 
		console.log("doActions",this.doActions)
		for (let i = 0; i < this.doActions.length; i++) {

			if(this.tab == 'do'){
				if(this.doActions[i].scheduled_date){
					console.log("here",this.doActions[i].scheduled_date)
					now = new Date(this.doActions[i].scheduled_date);
				}
					
			}else{
				if(this.doActions[i].target_date){
					console.log("here",this.doActions[i].target_date)
					now = new Date(this.doActions[i].target_date);
				}
			}
			
			let insertData = {
				d: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				color: this.doActions[i].color
			};
			this.markedDays.push(insertData);
			this.markedDays_strings.push(JSON.stringify(insertData));

			let then = new Date(datedata);
			let DaysDifference  = this.dateDiffInDays(then, now);
			console.log(DaysDifference);

			if (DaysDifference < 0) {
				this.overdueActionList.push(this.doActions[i]);
			} else if (DaysDifference == 0) {
				this.todayActionList.push(this.doActions[i]);
				
			} else if (DaysDifference >= 1 && DaysDifference <= 7) {
				this.thisWeekActionList.push(this.doActions[i]);
			} else{
				this.beyondList.push(this.doActions[i]);
			}
			
		if (i == this.doActions.length - 1) {
			console.log('Marked days');
			console.log(this.markedDays);
			console.log('DIFF DAYS LOG');
			console.log(this.overdueActionList);
			console.log(this.todayActionList);
			
			console.log(this.beyondList);
			

			let filter_list = [];
			let assign_list = [];
			for(let i=0;i<this.markedDays.length;i++){
				if(i==0){
					filter_list.push(this.markedDays_strings[i]);
					assign_list.push(this.markedDays[i]);
				}else{
						if(filter_list.includes(this.markedDays_strings[i])){
							//skip
						}else{
							filter_list.push(this.markedDays_strings[i]);
							assign_list.push(this.markedDays[i]);
						}
					}

					if(i == this.markedDays.length-1){
						console.log("Filtered list");
						console.log(assign_list);
						this.markedDays = assign_list;
					}
				}
			}
		}
		console.log("this.thisWeekActionList",this.thisWeekActionList);
			this.displayWeekList()
		
	}


	//Get All Data by calling API's for create Action Page.
	getCreatePageDropdownData() {
		this.enterpriseService.getpriorities(this.globals.currentEnterpriseId).subscribe(
			(result) => {
				if (result.status == Constants.HTTP_STATUS_OK) {
					this.ActionPriorities = result.body;
					console.log('Priorities...');
					console.log(result.body);
				} else {
				}
			},
			(error) => {
				console.log('Get Priorities error....');
			}
		);

		this.enterpriseService.getAllGoals(this.globals.currentEnterpriseId, 1, 1000, 'goal_title', 'asc',this.globals.currentUserId).subscribe(
			(result) => {
				console.log('Get all Goals...');
				console.log(result);
				if (result.status == Constants.HTTP_STATUS_OK) {
					this.AllGoals = result.body;
				} else {
				}
			},
			(error) => {
				console.log('Get All Goals error....');
			}
		);

		this.enterpriseService.TogetAllObjectivesService(this.globals.currentEnterpriseId,this.globals.currentUserId,1, 1000, 'objective', 'asc')
			.subscribe(
			(result) => {
				console.log('Get all Objectives...');
				console.log(result);
				if (result.status == Constants.HTTP_STATUS_OK) {
					this.Allobjectives = result.body;
				} else {
				}
			},
			(error) => {
				console.log('Get All Objectives error....');
			}
		);
	}
	
	//Quick Action function
	triggerQUickAction(event){
		console.log("Quick Action Triggered.");
		console.log(event);
		console.log(this.quickActionName);

		if(this.quickActionName == ''){
			return;
		}
		let quick_actions = {
			"action": this.quickActionName,
			"objective_id": 'null',
			"created_user_id":this.globals.currentUserId,
			"scheduled_date": "",
			"completed_date": "",
			"target_date": "",
			"description": "",
			"remarks": "null",
			"priority_id":  this.ActionPriorities[2].priority_id,
			"action_category_id": this.miscellaneousCatogeryID ? this.miscellaneousCatogeryID :'null',
			"enterprise_id": this.globals.currentEnterpriseId,
			"goal_id": "null",
			"milestone_id":"null",
			"action_type": this.goalTypes[0].goal_type_id
		};
		this.globals.showLoading('Please wait....');
		console.log(quick_actions);
		this.enterpriseService.createAction(quick_actions).subscribe((result)=>{
		console.log('Action creation is successful');
		console.log(result);
		this.globals.hideLoading('Please wait');
			if(result.status ==200){
				this.sweetAlertDisplay("Action created successfully", true);
				this.quickActionName = '';
				this.globals.hideLoading('Please wait');

				this.getCategoriesforActions();
			}else{
				this.sweetAlertDisplay("Action Creation failed, Try Again", false);
				this.globals.hideLoading('Please wait');
			}
		},(error)=>{
		console.log('Action creation Failed.');
		console.log(error);
		this.globals.hideLoading('Please wait');
		this.sweetAlertDisplay("Action Creation failed, Try Again", false);
		});
	}


	triggerQUickActionDo(event){
		console.log("Quick Action Triggered.");
		console.log(event);
		console.log(this.quickActionDo);

		if(this.quickActionDo == ''){
			return;
		}
		let quick_actions = {
			"action": this.quickActionDo,
			"objective_id": 'null',
			"created_user_id":this.globals.currentUserId,
			"scheduled_date": "",
			"completed_date": "",
			"target_date": "",
			"description": "",
			"remarks": "null",
			"priority_id":  this.ActionPriorities[2].priority_id,
			"action_category_id": this.miscellaneousCatogeryID ? this.miscellaneousCatogeryID :'null',
			"enterprise_id": this.globals.currentEnterpriseId,
			"goal_id": "null",
			"milestone_id":"null",
			"action_type": this.goalTypes[0].goal_type_id
		};
		this.globals.showLoading('Please wait....');
		console.log(quick_actions);
		this.enterpriseService.createAction(quick_actions).subscribe((result)=>{
		console.log('Action creation is successful');
		console.log(result);
		this.globals.hideLoading('Please wait');
			if(result.status ==200){
				//this.sweetAlertDisplay("Action created successfully", true);
				this.quickActionDo = '';
				this.globals.hideLoading('Please wait');

				this.getCategoriesforActions();
			}else{
				this.sweetAlertDisplay("Action Creation failed, Try Again", false);
				this.globals.hideLoading('Please wait');
			}
		},(error)=>{
		console.log('Action creation Failed.');
		console.log(error);
		this.globals.hideLoading('Please wait');
		this.sweetAlertDisplay("Action Creation failed, Try Again", false);
		});
	}

	clickDateHeader(index,flag){
		if(flag){
			this.days[index].visible = false
		}else{
			this.days[index].visible = true
		}
		
	}

	clickSortDate(index,flag){
		if(flag){
			this.days[index].sortvisible = false
		}else{
			this.days[index].sortvisible = true
		}
		
	}
	quickAction(){
		if(this.collapseFlag){
		this.collapseFlag = !this.collapseFlag
		this.chunkActions.forEach(element => {
			element.sortvisible = false;
			});
		}else{
			this.chunkActions.forEach(element => {
				element.sortvisible = true;
			});
			
			this.collapseFlag = !this.collapseFlag
		}
	}

	onTabChange(tab){
		this.actionList = []
		if(tab == 'do'){
			this.tab = 'do'
			//this.todayActionList = this.todayActionList
			
		}else{
			this.tab = 'due'
			//this.todayActionList = this.dueActions
		}
		this.processCalenderEvents(this.selectedDate)

	}

	refresh(){
		this.getCategoriesforActions();
		this.FindHelp = false;
		this.SortHelp = false;
		this.DoHelp = true;
	}

	displayWeekList(){	
		console.log(this.selectedDate)
		this. selectedWeekList = [];
		for (let i = 1; i <= 7; i++) {
			// if (i == 0) {
			
			// 	this.selectedWeekList.push(
			// 		{  displayDate : moment(this.selectedDate).add(i, 'days').format('dddd Do'),
			// 		formatDate:moment(this.selectedDate).add(i, 'days').format('YYYY-MM-DD'),
			// 			actions:[],
						
			// 		}
			// 	);
			// }else 
			if(i == 1) {
				this.selectedWeekList.push(
					{  displayDate : 'Tomorrow',
					formatDate:moment(this.selectedDate).add(i, 'days').format('YYYY-MM-DD'),
						actions:[],
						
					}
				);
			}else {
				this.selectedWeekList.push( 
					{displayDate : moment(this.selectedDate).add(i, 'days').format('dddd Do'),
					formatDate:moment(this.selectedDate).add(i, 'days').format('YYYY-MM-DD'),
						actions:[],
						
					}
				 );
			}
		
		} 
		console.log("days",this.selectedWeekList)
		console.log("thisWeekActionList",this.thisWeekActionList)
		//if(this.thisWeekActionList.length > 0){
			let list = _.map(this.thisWeekActionList, _.clone);
		// 	list.forEach(element => {
		// 	element['scheduled_date_disp'] = moment(element.scheduled_date).format('dddd Do')
		// });
		console.log("list",list)

		for(let i=0;i<  this.selectedWeekList.length;i++){
			for(let j=0;j<list.length;j++){
				// this.days[j].actions = []
				if(moment(list[j].scheduled_date).format('YYYY-MM-DD') == this.selectedWeekList[i].formatDate ){
					this.selectedWeekList[i].actions .push(list[j])
				}

			}
		}

		console.log("this.seeee",this.selectedWeekList)

		//}else{
			console.log("no luck")
		//}
		
	}

	clickAnotherDateHeader(val){
		if(val){
			this.otherDate.visible = false
		}else{
			this.otherDate.visible = true
		}
	}
	sortQUickAction(event,i){
		console.log("Quick Action Triggered.");
		console.log(event);
		console.log(this.sortTitle[i]);

		if(this.sortTitle[i] == ''){
			return;
		}
		let quick_actions = {
			"action": this.sortTitle[i],
			"objective_id": 'null',
			"created_user_id":this.globals.currentUserId,
			"scheduled_date": "",
			"completed_date": "",
			"target_date": "",
			"description": "",
			"remarks": "null",
			"priority_id":  this.ActionPriorities[2].priority_id,
			"action_category_id": this.chunkActions[i].category_id,
			"enterprise_id": this.globals.currentEnterpriseId,
			"goal_id": "null",
			"milestone_id":"null",
			"action_type": this.goalTypes[0].goal_type_id
		};
		this.globals.showLoading('Please wait....');
		console.log(quick_actions);
		this.enterpriseService.createAction(quick_actions).subscribe((result)=>{
		console.log('Action creation is successful');
		console.log(result);
		this.globals.hideLoading('Please wait');
			if(result.status ==200){
				this.sweetAlertDisplay("Action created successfully", true);
				this.sortTitle[i] = '';
				this.globals.hideLoading('Please wait');

				this.getCategoriesforActions();
			}else{
				this.sweetAlertDisplay("Action Creation failed, Try Again", false);
				this.globals.hideLoading('Please wait');
			}
		},(error)=>{
		console.log('Action creation Failed.');
		console.log(error);
		this.globals.hideLoading('Please wait');
		this.sweetAlertDisplay("Action Creation failed, Try Again", false);
		});
	}

}

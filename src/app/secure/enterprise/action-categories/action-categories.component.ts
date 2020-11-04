import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreateCategoriesComponent } from "./create-categories/create-categories.component";
import { UserService, EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { GlobalService } from 'src/app/global/app.global.service';
import { AuthenticationService } from 'src/app/services';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-action-categories',
  templateUrl: './action-categories.component.html',
  styleUrls: ['./action-categories.component.css']
})
export class ActionCategoriesComponent implements OnInit {

  categories: any = [];
  selectedCategoryInfo:any = null;
  filterBy: string = "";
  modalRef: BsModalRef;
  searchText: string;
  modalType: string = 'NEW';
  direction: number;
	isDesc: boolean = false;
  column: string;
  searchBy: any;
  sortDirection: string = 'asc';
  currentPage = 1;
	page: number;
  pageSize: number = 10;
  totalItems: number = 0;
  userLogs: UserLog = new UserLog();
  catogery_names_list = [];

  constructor(private enterpriseService: EnterpriseService, private globals:GlobalService, private modalService: BsModalService, private userService: UserService, private authenticationService:AuthenticationService) {
    this.getactionCategories();
    this.pageSize = this.globals.pageSize;
    this.searchBy = this.getSearchObject();
  }

  ngOnInit() {
  }

  refreshPageData() {
    this.getactionCategories();
  }

  public auctiondata= ['1','2','3','4','5','6']
  getSearchDetailsFromServer(){

  }

  sortBykey(key) {
		this.direction = this.isDesc ? 1 : -1;
		this.isDesc = !this.isDesc;
    this.column = key;

  }

  refreshSearch() {
		this.searchBy = this.getSearchObject();
  }

  getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			searchObj['name'] = this.searchText;
    } else if (this.filterBy == 'name') {
			searchObj['name'] = this.searchText;
		}
    return searchObj;
  }

  pageChanged(event: any): void {
		this.page = event.page;
  }

  //To Get all Categories
  getactionCategories() {
    this.globals.showLoading('Please wait');
    this.enterpriseService.getActionCategory(this.globals.currentEnterpriseId,this.globals.currentUserId,this.currentPage,this.pageSize).subscribe(
      (result) => {
        this.globals.hideLoading('Please wait');
        console.log("[Success]Loaded All Categories");
        console.log(result.body);
        this.categories = result.body;
        this.catogery_names_list = [];
        for(let i=0;i<this.categories.length;i++){
          this.catogery_names_list.push(this.categories[i].name);
        }
      }
    )
  }

  //To create/edit category
  openActionsModal() {
    console.log("Clicked Action modal");
    const initialState = {
      modalType: this.modalType,
      modalData: this.selectedCategoryInfo,
      categories: this.categories,
      filterList:this.catogery_names_list
    };
    this.modalRef = this.modalService.show(CreateCategoriesComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));
    this.modalRef.content.event.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        this.getactionCategories();
      }
    });
  }

  //To create category
  createAction(){
    this.modalType = 'NEW';
    this.selectedCategoryInfo = null;
    this.openActionsModal();
  }

  //To edit category
  editCategory(category) {
    this.modalType = 'EDIT';
    this.selectedCategoryInfo = category;
    this.openActionsModal();
  }

  //To Delete Category PopUp
  deleteCategory(data) {
    console.log(data)
    swal.fire({
      html: '<span style="font-size:large;">Are you sure to delete the Category </span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
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
    }).then((result) => {
      if (result.value) {
        console.log(data.enterprise_id);
        console.log(data.user_id);
        console.log(data.category_id);
        this.globals.showLoading("Please wait ...")
        this.enterpriseService.deleteActionCategory(data.enterprise_id, data.user_id, data.category_id).subscribe(
          (result) => {
            if (result.status == 200) {
              this.globals.hideLoading("Please wait ...")
              console.log(result);
              this.showMessageAndLoadValues('Category deleted successfully.');
            } else {
              this.globals.hideLoading("Please wait ...")
              console.log("Delete Api server error.");
            }
          }, (err) => {
            this.globals.hideLoading("Please wait ...")
          });
      }
    }, (error) => {
      console.log("Category has not been Deleted.");
      this.globals.hideLoading("Please wait ...")
    })
  }

  //To show the delete pop message
  showMessageAndLoadValues(title) {
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
        this.getactionCategories();
      }
    });
  }

  //User Activity
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

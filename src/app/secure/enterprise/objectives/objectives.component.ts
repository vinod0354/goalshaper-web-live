import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ObjectivesCreateComponent } from './objectives-create/objectives-create.component';
import swal from 'sweetalert2';
import { ObjectivesActivityComponent } from './objectives-activity/objectives-activity.component';
import { EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { Constants } from 'src/app/global/app.global.constants';
import { DatePipe } from '@angular/common'
// import { KeyedRead } from '@angular/compiler';
import * as XLSX from 'xlsx';
import { combineAll } from 'rxjs/operators';



@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.css']
})
export class ObjectivesComponent implements OnInit {
  modalType: string = 'create';
  filterBy = 'objective';
  SortBy: string = 'objective,asc';
  modalRef: BsModalRef;
  allGoals: any[] = [];
  allObjectives: any[] = [];
  searchText: string = '';
  public ToLoadAllObjectives = [];
  totalItems: number = 0;
  displayStyle = 'grid';
  pageSize: number = 10;
  currentPage = 1;
  direction: number;
  isDesc: boolean = false;
  column: string = 'objective';
  searchBy: any;
  sortDirection: string = 'asc';
  page: number;
  /*name of the excel-file which will be downloaded. */
  fileName = 'ExcelSheet.xlsx';
  ForExportObjectives = [];
  IsExportExit = false;
  filter_objective_level = 1;
  objectiveLevels = [];
  objectiveLevelId = '';
  constructor(private modalService: BsModalService, private enterpriseService: EnterpriseService, private globals: GlobalService, private datepipe: DatePipe) {
    var localGoallevels = localStorage.getItem('GoalLevels');
    if(localGoallevels != undefined && localGoallevels != null && localGoallevels != ''){
      this.objectiveLevels = JSON.parse(localGoallevels);
    }else{
      this.getObjectiveLevels();
    }
  }


  getObjectiveLevels() {
    this.enterpriseService.getGoalLevels(this.globals.currentEnterpriseId).subscribe((result) => {
      if (result.status == 200) {
        this.objectiveLevels = result.body;
        localStorage.setItem('GoalLevels', JSON.stringify(this.objectiveLevels));
      } else {
        console.log("Get Goal levels status API status : " + result.status);
      }
    }, (err) => {
      console.log("Get Goal levels status API Error : ");
      console.log(err);
    });
  }

  ngOnInit() {
    this.TogetAllObjectives();
  }
  public RoleID = this.globals.currentUserRoleId;

  //To Get All Objectives API
  TogetAllObjectives() {
    this.globals.showLoading('Please wait');
    console.log(this.globals.currentEnterpriseId);
    this.enterpriseService.TogetAllObjectivesService(this.globals.currentEnterpriseId, this.globals.currentUserId, this.currentPage, this.pageSize, this.column, this.sortDirection).subscribe(
      (result) => {
        this.globals.hideLoading('Please wait');
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.ToLoadAllObjectives = result.body;
          console.log(this.ToLoadAllObjectives)
          this.totalItems = parseInt(result.headers.get('x-total-rows'));
          if (this.IsExportExit == true) {
            this.enterpriseService.TogetAllObjectivesService(this.globals.currentEnterpriseId, this.globals.currentUserId, this.currentPage, this.totalItems, this.column, this.sortDirection).subscribe(
              (result) => {
                console.log(result.body)
                this.ForExportObjectives = result.body
              });
          }
          if (result.body == null) {
            this.ToLoadAllObjectives = [];
          }
        } else if (result.status == Constants.HTTP_STATUS_NO_CONTENT) {
          this.ToLoadAllObjectives = [];
          this.totalItems = 0;
        } else {
          this.ToLoadAllObjectives = [];
          this.totalItems = 0;
        }
      }, (err) => {
        this.globals.hideLoading('Please wait');
        console.log("[FAILURE]Loaded All Goals");
        console.log(err);
        this.ToLoadAllObjectives = [];
        this.totalItems = 0;
      });

  }

  //To Export function

  exportexcel(): void {
    this.IsExportExit = true;
    /* table id is passed over here */
    let newArray: any[] = [];
    let data = Object.values(this.ForExportObjectives);
    Object.keys(data).forEach((key, index) => {
      newArray.push({
        'S.No': index + 1,
        'Goal Title': data[key].objective,
        'Target Date': new Date(data[key].target_date),
        'Description': data[key].description,
        'Edit': "--",
        'Delete': "--"
      })
    })
    if (this.searchText.length == 0 || this.searchText == " ") {
      var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    } else {
      console.log("else")
      let element = document.getElementById('goalsactivity');
      console.log(element)
      var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    }
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var wscols = [
      { wch: 10 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },

    ];

    ws["!cols"] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName, { bookType: 'xlsx', type: 'buffer' });
  }


  //For Pagination Page by page change Event
  pageChanged(event: any): void {
    this.page = event.page;
    this.currentPage = event.page;
    this.TogetAllObjectives();

  }


  //To Change the Grid and List view type
  setStyle(type) {
    this.displayStyle = type;
    console.log(this.displayStyle);
  }

  //Grid View Sorting
  sortBykeyValue() {
    var nameArr = this.SortBy.split(',');
    this.column = nameArr[0];
    this.sortDirection = nameArr[1];
    console.log(this.column);
    console.log(this.sortDirection);
    this.TogetAllObjectives()
  }

  //Sorting Event
  sortBykey(key) {
    this.direction = this.isDesc ? 1 : -1;
    this.isDesc = !this.isDesc;
    this.column = key;
    if (this.direction == 1) {
      this.sortDirection = 'asc';
    } else {
      this.sortDirection = 'desc';
    }
    this.SortBy = this.column + "," + this.sortDirection;
    console.log(this.SortBy);
    // Cal API Here
    console.log(this.column);
    console.log(this.sortDirection);
    this.TogetAllObjectives();
  }


  //ToRefreah The Page Values
  refreshPageData() {
    this.ToLoadAllObjectives = [];
    this.TogetAllObjectives();
    this.searchText = '';
    this.filterBy = "objective";
    this.currentPage = 1;
    /* Page refresh method will be called here */
  }

  //To Fillter
  refreshSearch() {
    console.log("ggdfdsf")
    if(this.filterBy == "objective" || this.filterBy=='objective_level_id'){
    if(this.searchText==''){
      this.TogetAllObjectives();
    }
  }else{
    if(this.searchText == null){
      console.log(this.searchText)
      this.TogetAllObjectives();
    }
  }
  }

  //To empty the input search box
  changeSearch() {
    this.searchText = '';
    this.TogetAllObjectives();
  }

  selectObjectiveLevel(){
    // let searchValue = this.objectiveLevelId;
    // console.log("Selection Changed...");
    // console.log(searchValue);

  }

  //To filter based on objective and objective level
  public filteredobjective;
  ToFilterbasedOnObjectives() {
    if (this.filterBy == 'objective') {
      var searchColumn = 'objective';
      var searchValue = this.searchText;
    }
    if(this.filterBy=='objective_level_id'){
      console.log("i am in goal level id");
      var searchColumn = 'objective_level_id';

      var searchValue = this.objectiveLevelId;
      console.log('Search Value:' + searchValue);


        // if(((this.searchText).toLowerCase()).indexOf("enterprise") != -1){
        //   var searchColumn = 'objective_level_id';
        //   var searchValue = '1';
        // } else if(((this.searchText).toLowerCase()).indexOf("team") != -1){
        //   var searchColumn = 'objective_level_id';
        //   var searchValue = '2';
        // } else if(((this.searchText).toLowerCase()).indexOf("individual") != -1){
        //   var searchColumn = 'objective_level_id';
        //   var searchValue = '3';
        // }
    }
    this.globals.showLoading("Please wait ...")
    this.enterpriseService.ToFilterbasedOnObjective(this.globals.currentEnterpriseId, this.globals.currentUserId, searchColumn, searchValue, this.currentPage, this.pageSize, this.sortDirection).subscribe(result => {
      console.log(result)
      if (result.status == 200) {
        this.filteredobjective = result.body;
        console.log(this.filteredobjective.length)
        this.ToLoadAllObjectives = this.filteredobjective;
        this.totalItems = parseInt(result.headers.get('x-total-rows'));
        this.globals.hideLoading("Please wait ...");
      }
      if (result.status == 204) {
        console.log("i am else part in datefilter");
        this.globals.hideLoading("Please wait ...");
        this.ToLoadAllObjectives.length = 0;
        this.ToLoadAllObjectives.length = 0;
        this.totalItems = 0;
        this.ToLoadAllObjectives= [];
      }
    }, (err) => {
      this.globals.showErrorMessage('Something went wrong. Please try later!');
      console.log(err);
      this.globals.hideLoading("Please wait ...");
      this.ToLoadAllObjectives.length = 0;
        this.totalItems = 0;
        this.ToLoadAllObjectives= [];
    })

  }

  //To select Date Range
  startdate; '';
  enddate = '';
  public searchObjdate;
  changeDate(data) {
    console.log(data)
    this.startdate = this.datepipe.transform(data[0], 'dd-MM-yyyy')
    console.log(this.startdate);
    this.enddate = this.datepipe.transform(data[1], 'dd-MM-yyyy')
    console.log(this.enddate);
  }

 //To filter based on Dates
    ToFilterbasedOnDates(){
      var S_date = this.startdate.split("-").reverse().join("-");
      console.log(S_date);
      var E_date = this.enddate.split("-").reverse().join("-");
      console.log(E_date);
      if (this.filterBy == 'target_date') {
        var searchColumn = 'target_date';
      }
      if (this.filterBy == 'completed_date') {
        var searchColumn = 'completed_date';
      }
    this.globals.showLoading("Please wait ...")
    this.enterpriseService.ToFilterbasedOnDate(this.globals.currentEnterpriseId, this.globals.currentUserId, searchColumn, S_date, E_date, this.currentPage, this.pageSize, this.sortDirection).subscribe(result => {
      console.log(result);
      if (result.status == 200) {
        this.searchObjdate = result.body;
        console.log(this.searchObjdate.length)
        this.ToLoadAllObjectives = this.searchObjdate;
        this.totalItems = parseInt(result.headers.get('x-total-rows'));
        this.globals.hideLoading("Please wait ...");
      }
      if (result.status == 204) {
        console.log("i am else part in datefilter");
        this.globals.hideLoading("Please wait ...");
        this.ToLoadAllObjectives.length = 0;
        this.totalItems = 0;
        this.ToLoadAllObjectives= [];

      }
    }, (err) => {
      this.globals.showErrorMessage('Something went wrong. Please try later!');
      console.log(err);
      this.globals.hideLoading("Please wait ...");
      this.ToLoadAllObjectives.length = 0;
      this.totalItems = 0;
      this.ToLoadAllObjectives= [];
    });

  }

  //To Create and Edit PopUp Model Function
  openObjectivesModal(type, data) {
    if (type == 'update') {
      console.log("Update");
      console.log(data.created_user_id);
      console.log(this.globals.currentUserId)
      // if(this.globals.currentUserId)
    }
    console.log(type)
    console.log("Clicked objective modal", data);
    const initialState = {
      modalType: type,
      modalData: data
    };
    this.modalRef = this.modalService.show(ObjectivesCreateComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));
    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        this.searchText = '';
        this.filterBy = "objective";
        this.TogetAllObjectives();

      }
    });
  }



  //To open activity Popup
  openObjectActivity(data) {
    console.log(data)
    const initialState = {
      modalType: this.modalType,
      modalData: data
    };
    this.modalRef = this.modalService.show(ObjectivesActivityComponent, Object.assign({ initialState }, { class: 'gray modal-lg' }));
    this.modalRef.content.eventT.subscribe(data => {
      console.log('Child component\'s event was triggered', data);
      if (data == 'true') {
        /* Goals loading method should be called here */
      }
    });
  }

  //To Delete Objective PopUp
  openDeleteConfirmDialog(data) {
    if (this.globals.currentUserId != data.created_user_id) {
      swal.fire({
        html: '<span style="font-size:large;">You are not authorized to delete this Objective </span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
        // showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        imageUrl: 'assets/img/Cancel-48.png',
        // iconHtml: '<img src="assets/img/Question-48.png" style="width:45px; height:45px;"/>',
        allowOutsideClick: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        allowEscapeKey: false
      });

    } else {

      swal.fire({
        html: '<span style="font-size:large;">Are you sure to delete the Objective </span> <span style="font-size:large; color:red; font-weight:bold;"></span>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        imageUrl: 'assets/img/Question-48.png',
        iconHtml: '<img src="assets/img/Cancel-48.png" style="width:45px; height:45px;"/>',
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
          console.log(data.objective_id);
          this.globals.showLoading("Please wait ...")
          this.enterpriseService.deleteObjective(data.enterprise_id, data.objective_id).subscribe(
            (result) => {
              if (result.status == 200) {
                this.globals.hideLoading("Please wait ...")
                console.log(result);
                this.showMessageAndLoadValues('Objective deleted successfully.');
              } else {
                this.globals.hideLoading("Please wait ...")
                console.log("Delete Api server error.");
              }
            }, (err) => {
              this.globals.hideLoading("Please wait ...")
            });
        }
      }, (error) => {
        console.log("Goal has not been Deleted.");
        this.globals.hideLoading("Please wait ...")
      })
    }
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
        this.TogetAllObjectives();
      }
    });
  }




}

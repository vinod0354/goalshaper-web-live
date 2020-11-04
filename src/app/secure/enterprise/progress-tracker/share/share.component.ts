import { Component, OnInit,EventEmitter } from '@angular/core';
import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';
import { BsModalRef } from 'ngx-bootstrap';
import { ShareService } from 'src/app/services';
mobiscroll.settings = {
	theme: 'material',
	themeVariant: 'light'
};

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  public modalData;
  public shareT: EventEmitter<any> = new EventEmitter();
  sortedResults:any;
  constructor(public bsModalRef: BsModalRef,public shareService:ShareService) { }

  ngOnInit() {
    this. sortedResults=  this.modalData.map(({ action:Action,action_category_id,action_id,action_type,category_name:Category_Name,color, completed_date:Completed_Date, created_date:Created_Date, created_user_id,description:Description ,
      enterprise_id,goal_id,milestone_id,modified_date:Modified_Date ,modified_user_id,name,objective_id,priority_id,priority_name,remarks,scheduled_date:Do_Date, target_date:Due_Date}) => ({
         Action,
         action_category_id,
         action_id,
         action_type,
         Category_Name,
         color,
         Completed_Date,
         Created_Date,
         created_user_id,
         Description,
         enterprise_id,
         goal_id,
         milestone_id,
         Modified_Date,
         modified_user_id,
         name,
         objective_id,
         priority_id,
         priority_name,
         remarks,
         Do_Date,
         Due_Date
        }));

        for (let i = 0; i < this.sortedResults.length; i++) {

          if(this.sortedResults[i].Due_Date .includes('1900') || this.sortedResults[i].Due_Date .includes('1899')){
            this.sortedResults[i].Due_Date = "-"
          }
          if(this.sortedResults[i].Completed_Date .includes('1900') || this.sortedResults[i].Completed_Date .includes('1899')){
            this.sortedResults[i].Completed_Date = "-"
          }
        }
  
  }


  closeModal(){
    this.bsModalRef.hide();
  }
  print(){
    this.bsModalRef.hide();
    this.shareT.emit('print');
  }

  exportToCSV(){
    this.bsModalRef.hide();
    
    return this.shareService.downloadFile(this.sortedResults)
  }
  

}

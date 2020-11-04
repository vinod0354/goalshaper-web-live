import { Component, EventEmitter, OnInit } from '@angular/core';
import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';
import { BsModalRef } from 'ngx-bootstrap';
import { EnterpriseService } from 'src/app/services';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/global/app.global.service';
import moment from 'moment';

mobiscroll.settings = {
	theme: 'ios',
	themeVariant: 'light'
};

@Component({
  selector: 'app-add-date',
  templateUrl: './add-date.component.html',
  styleUrls: ['./add-date.component.css']
})
export class AddDateComponent implements OnInit {

  public modalData;
  markedDay:any;
  markedDays = [];
  min_date:any;
  public addT: EventEmitter<any> = new EventEmitter();
  selectedDate:any

  constructor(public bsModalRef: BsModalRef, private datapipe:DatePipe, private enterpriseService: EnterpriseService, private globals: GlobalService) { 
    this.min_date = this.datapipe.transform(new Date(), 'yyyy-MM-dd')
  }

  ngOnInit() {
    console.log(this.modalData)
  }

  getDetailsofClick(data) {
    console.log(data);
    this.selectedDate = data.valueText
    // this.processCalenderEvents(data.valueText);
    this.modalData.scheduled_date = data.valueText
    console.log(this.modalData);
  }

  updateScheduledDate(){
    
    let date = this.selectedDate? this.selectedDate:moment().format('YYYY-MM-DD')
    this.modalData.scheduled_date = date
    if(date){
      this.globals.showLoading('Please wait')
      this.enterpriseService.updateAction(this.modalData.action_id,this.modalData).subscribe((result)=>{
        console.log(result);
        if(result.status == 200){
          console.log("Succesfully updated.");
          this.globals.hideLoading('Please wait')
          this.addT.emit('true');
          this.bsModalRef.hide();
        }else{
          console.log('Api error');
          this.globals.hideLoading('Please wait');
        }
        },(error)=>{
          console.log(error);
          this.globals.showErrorMessage('Something went wrong!')
        }) 
    }else{
      console.log('datenot selected')
    }
   

  }

  closeModal(){
    this.bsModalRef.hide();
  }

}

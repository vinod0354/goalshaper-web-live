import { Component, OnInit , EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';

@Component({
  selector: 'app-update-qsn',
  templateUrl: './update-qsn.component.html',
  styleUrls: ['./update-qsn.component.css']
})
export class UpdateQsnComponent implements OnInit {

  @Input() question;
  @Input() enterprise_id;
  @Input() question_id;
  public eventT: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,private enterpriseService:EnterpriseService,private globals: GlobalService) { }

  ngOnInit() {
    console.log(this.question)
  }

  closeModal(){
    this.bsModalRef.hide();
  }

  updateQuestion(){
    if(!this.question){
      this.bsModalRef.hide();
      return
    }
    this.globals.showLoading('Please wait');
    console.log(this.question)
    let data = [
      {
        "question_id": parseInt(this.question_id),
        "enterprise_id": parseInt(this.enterprise_id),
        "question": this.question
      }
    ]
    if(this.question == '') {
      this.globals.showErrorMessage('Question should not be empty!');
    }else{
      this.enterpriseService.updatePulseQuestions(data).subscribe(
        (resdata) => {
         console.log("resdata",resdata)
         this.eventT.emit(true)
         this.globals.hideLoading('Please wait');
         this.bsModalRef.hide();
        },err =>{
          console.log(err)
          this.globals.hideLoading('Please wait');
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
  
      )
    }
  }

}

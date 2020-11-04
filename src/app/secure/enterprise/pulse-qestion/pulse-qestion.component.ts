import { Component, OnInit, PipeTransform } from '@angular/core';
import { GlobalService } from 'src/app/global/app.global.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UpdateQsnComponent } from './update-qsn/update-qsn.component';
import { EnterpriseService } from 'src/app/services';

@Component({
  selector: 'app-pulse-qestion',
  templateUrl: './pulse-qestion.component.html',
  styleUrls: ['./pulse-qestion.component.css']
})
export class PulseQestionComponent implements OnInit {

  totalItems: number = 0;
  Page: number = 1;
  questions: any;
  modalRef: BsModalRef;

  constructor(private globals:GlobalService, private modalService: BsModalService,private enterpriseService:EnterpriseService) { 
  }

  ngOnInit() {
    this.loadQuestions();
  }

  editQsn(item) {
    const initialState = item
    this.modalRef = this.modalService.show(
      UpdateQsnComponent,
      Object.assign({ initialState },{ class: 'gray modal-lg' })
    );
    this.modalRef.content.eventT.subscribe((data) => {
      console.log("Child component's event was triggered", data);
      if (data) {
        this.loadQuestions()
      }
    },err => {
      console.log(err);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    });
  }
  
  loadQuestions() {
    this.globals.showLoading('Please wait');
    this.enterpriseService.getPulseQuestions(this.globals.currentEnterpriseId).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
        console.log("resdata",resdata)
        this.questions = resdata.body
      },err =>{
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      }
    );
  }

}

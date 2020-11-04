import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { GlobalService } from '../global/app.global.service';
import { EnterpriseService } from '../services';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
 
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  public modalData;
  public deleteT: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef, private enterpriseService:EnterpriseService, private globals:GlobalService,public pubsubSvc: NgxPubSubService) { }

  ngOnInit() {
    console.log(this.modalData)
  }

  closeModal(){
    this.bsModalRef.hide();
  }

  DeleteAction() {
    this.globals.showLoading('Please wait');
    this.enterpriseService.deleteAction(this.globals.currentEnterpriseId,this.modalData.action_id).subscribe((result)=>{
      console.log(result);
      if(result.status == 200){
        console.log(result);
        console.log('Action deleted');
     //   this.deleteT.emit('true');
        this.pubsubSvc.publishEvent('deleted')
        this.bsModalRef.hide();
        this.globals.hideLoading('Please wait')
      //  this.sweetAlertDisplay("Action Deleted successfully", true);
        
      }else{
        console.log("Delete Api server error.");
        this.globals.showErrorMessage('Something went wrong. Please try later!')
      }
    },(error)=>{
      console.log(error);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    });
  }

}

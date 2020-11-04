import { Component, OnInit,EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/global/app.global.service';
import { EnterpriseService } from 'src/app/services';



@Component({
  selector: 'app-goals-activity',
  templateUrl: './goals-activity.component.html',
  styleUrls: ['./goals-activity.component.css']
})
export class GoalsActivityComponent implements OnInit {

  public eventT: EventEmitter<any> = new EventEmitter();

 public modalData;

 goalActivity  = [];;
 goals:any;
 milestones1Activity = [];
 milestones2Activity = [];
 milestones3Activity = [];
 milestones4Activity = [];
 NoDataAvailable_statusText = 'loading...'


  constructor(public bsModalRef: BsModalRef, public globals: GlobalService, public server:EnterpriseService) { }

  ngOnInit() {
    console.log("Importred Data");
    console.log(this.modalData);
    this.goals = this.modalData;


    this.server.getGoalsActivity(this.goals.enterprise_id,this.goals.goal_id).subscribe((result)=>{
      this.NoDataAvailable_statusText = 'Loading...'
      if(result.status == 200){
        console.log('Goals Activity :');
        console.log(result);
        this.goalActivity = result.body;
        console.log(this.goalActivity);
        if(this.goalActivity.length == 0){
          this.NoDataAvailable_statusText = 'No Data Avialable';
        }

        /* Getting First letter  */

      } else{
        console.log("Goals Activity APi went wroeng with error : "+result.status);
        this.NoDataAvailable_statusText = 'No Data Avialable';
      }


    },(err)=>{
      console.log("Goals Activity APi error");
      this.NoDataAvailable_statusText = 'No Data Avialable';

    });

    this.server.getMilesstonesActivity(this.goals.enterprise_id,this.goals.goal_id).subscribe((result)=>{
      if(result.status == 200){
      console.log('milestones Activity :');
      console.log(result.body);
      this.milestones1Activity = result.body.milestone1History;
      this.milestones2Activity = result.body.milestone2History;
      this.milestones3Activity = result.body.milestone3History;
      this.milestones4Activity = result.body.milestone4History;
      } else{
        console.log("Milestones Activity APi went wroeng with error : "+result.status);
      }

    },(err)=>{
      console.log("Milestones Activity APi error");

    });
  }
  closeModal(){
    this.bsModalRef.hide();
  }
}

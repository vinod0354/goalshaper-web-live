import { Component, OnInit,EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/global/app.global.service';
import { UserService, EnterpriseService } from 'src/app/services';
import { concat } from 'rxjs';


@Component({
  selector: 'app-objectives-activity',
  templateUrl: './objectives-activity.component.html',
  styleUrls: ['./objectives-activity.component.css']
})
export class ObjectivesActivityComponent implements OnInit {
  public eventT: EventEmitter<any> = new EventEmitter();
  public modalType;
  public modalData;
  public description: string = '';
  public objective;
  public targetDate;
  public milestone_id;
  public milestone;
  public goal_title;
  HistoryData = [];
  constructor(public bsModalRef: BsModalRef, public globals: GlobalService,public enterpriseService: EnterpriseService) { }

  ngOnInit() {

    console.log(this.modalData);
    this.objective = this.modalData.objective;
    this.description = this.modalData.description;
    this.targetDate = this.modalData.target_date;
    this.milestone_id = this.modalData.milestone_id;
    this.milestone = this.modalData.milestone;
    this.goal_title = this.modalData.goal_title;
    this.TogetObjectivesActivities();
  }

  //To Get Objectives Activities
  TogetObjectivesActivities(){
    let activityEnter_ID = this.globals.currentEnterpriseId;
    let activityObjective_Id = this.modalData.objective_id;
    this.enterpriseService.TogetObjectivesActivitiesService(activityEnter_ID,activityObjective_Id).subscribe(
      (result) => {
        console.log(result.body);
        this.HistoryData = result.body;
        console.log(this.HistoryData);
        for (var index in this.HistoryData) {
         var Firstname = this.HistoryData[index].firstname.replace(/ +/g, "");
         var firstname_1stCharacter = Firstname.split(" ").map(n => n[0]);
         console.log(firstname_1stCharacter)
         var lastname = this.HistoryData[index].lastname.replace(/ +/g, "");
         var lastname_1stCharacter = lastname.split(" ").map(n => n[0]);
         console.log(lastname_1stCharacter)
         let F_L_Name = firstname_1stCharacter + lastname_1stCharacter;
         this.HistoryData[index].FirstCharacter_Names = F_L_Name;
         console.log(this.HistoryData);
        }
      });
  }

  closeModal(){
    this.bsModalRef.hide();
  }

}

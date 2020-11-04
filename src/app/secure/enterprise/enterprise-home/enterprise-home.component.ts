import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global/app.global.service';
import { EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise-home',
  templateUrl: './enterprise-home.component.html',
  styleUrls: ['./enterprise-home.component.css']
})
export class EnterpriseHomeComponent implements OnInit {

  summaryInfo:any = {
    totalGoals: 0,
    activeGoals: 0,
    totalObjectives: 0,
    activeObjectives: 0,
    totalTeams: 0,
    totalIndividuals: 0
  };

  roleId: number = 0;

  summaryDetails: any = {
    today: {
      goals: [{
        id: '',
        title: '',
        target_date: ''
      }],
      objectives:[{
        id: '',
        title: '',
        target_date: ''
      }]
    },
    next7Days: {
      goals: [{
        id: '',
        title: '',
        target_date: ''
      }],
      objectives:[{
        id: '',
        title: '',
        target_date: ''
      }]
    },
    next30Days:{
      goals: [{
        id: '',
        title: '',
        target_date: ''
      }],
      objectives:[{
        id: '',
        title: '',
        target_date: ''
      }]
    },
    next6Months:{
      goals: [{
        id: '',
        title: '',
        target_date: ''
      }],
      objectives:[{
        id: '',
        title: '',
        target_date: ''
      }]
    },
    next12Months:{
      goals: [{
        id: '',
        title: '',
        target_date: ''
      }],
      objectives:[{
        id: '',
        title: '',
        target_date: ''
      }]
    }
  };
  constructor(private enterpriseService: EnterpriseService, private globals:GlobalService, private router:Router) {
    this.roleId = this.globals.currentUserRoleId;
    this.loadAllData();
  }


  loadAllData(){
    var totalResponseCount = 0;
    this.globals.showLoading('Please wait');
    console.log('Ids to Send:' + this.globals.currentEnterpriseId+','+this.globals.currentUserRoleId);
    console.log(this.globals.currentUserId)

    /* Summary Info */
    this.enterpriseService.getSummaryInfo(this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (result) => {
        totalResponseCount++;
        console.log(result);
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.summaryInfo = result.body;
        }

        if(totalResponseCount == 2){
          this.globals.hideLoading('Please wait');
        }
      },
      (error) => {
        totalResponseCount++;
        this.globals.showErrorMessage('Loading Data Failed. Please Try Later!');
        console.log('Error Block');
        console.log(error);
      }
    );

    /* Summary Details Info */
    this.enterpriseService.getSummaryDetailsInfo( this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (result) => {
        console.log(result);
        totalResponseCount++;
        if (result.status == Constants.HTTP_STATUS_OK) {
          this.summaryDetails = result.body;
        }

        if(totalResponseCount == 2){
          this.globals.hideLoading('Please wait');
        }
      },
      (error) => {
        totalResponseCount++;
        this.globals.showErrorMessage('Loading Data Failed. Please Try Later!');
        console.log('Error Block');
        console.log(error);
      }
    );
  }

  goalsScreen(){
    this.router.navigateByUrl('ent/goals');
  }
  objectivesScreen()
  {
    this.router.navigateByUrl('ent/objectives');
  }
  actionScreen(){
    this.router.navigateByUrl('ent/actions');
  }
  teamScreen(){
    this.router.navigateByUrl('ent/teams');
  }
  individualScreen(){
    this.router.navigateByUrl('ent/individuals');
  }

  ngOnInit() {
  }

}

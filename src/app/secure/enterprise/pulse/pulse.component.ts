import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import * as _ from "lodash"
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.css']
})
export class PulseComponent implements OnInit {

  questions:any;
  answers:any = []
  commentPreference:any;
  professionalComments ='';
  personalComments="";
  Comments:any;
  pComments:any
  personalAnswers:any =[]
  goalTypes:any;
  professionalGoalId:any;
  personalGoalId:any;
 totalProfComments:any;
 totalPersonalComments:any;
  
  
  constructor(private enterpriseService:EnterpriseService,private globals:GlobalService) { }

  value = 1
  options: Options = {
    showTicksValues: true,
     floor: 1,
    ceil: 5,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5}
    ]
  };

  options2: Options = {
    showTicksValues: true,
     floor: 0,
    ceil: 5,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5}
    ]
  };

  options3: Options = {
    showTicksValues: true,
     floor: 0,
    ceil: 5,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5}
    ]
  };


  ngOnInit() {
    this. getGoalTypes()
    this.getQuestions();
    this.getComments();
   // this.getPersonalComments();
    
    this.commentPreference = 'name'
  }

  getQuestions(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getPulseUserQuestions(this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
        console.log("resdata",resdata)
        resdata.body.forEach(element => {
        element.score = 1
        element.comment_type =""
        element.comment = ""
        
			});
       this.questions = resdata.body

      },err =>{
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      }
    );
  }	 
  
  getGoalTypes(){
    this.enterpriseService.getGoalTypes(this.globals.currentEnterpriseId).subscribe((result) => {
      this.goalTypes = result.body
      console.log("goalType",result)
      result.body.filter(X=>{
        if(X.type_name == "Professional"){
            this.professionalGoalId = X.goal_type_id
          }else{
            this.personalGoalId = X.goal_type_id
          }
        }
      )
    },err =>{
      console.log(err);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
  }

  getComments(){
    this.globals.showLoading('Please wait');
    let profComments = [];
  let   psnlComments = [];
    this.enterpriseService.getPulseComments(this.globals.currentEnterpriseId,this.globals.currentUserId).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
        console.log("Comments",resdata)
        this.Comments = resdata.body
        resdata.body.filter(x=>{
          if(x.comment_type == this.personalGoalId){
            psnlComments.push(x)
          }
          if(x.comment_type == this.professionalGoalId){
            profComments.push(x)
          }
        })


        console.log("this.psnlComments",psnlComments)
        console.log("this.profCo",profComments)
        this.enterpriseService.getPulseCommentsAnony(this.globals.currentEnterpriseId).subscribe(
          (response) => {
           console.log("Comments",response)
           this.pComments = response.body
           let arr = [...profComments, ...this.pComments]
           this.totalProfComments = _.sortBy(arr, ['created_date']).reverse();
           this.totalPersonalComments =_.sortBy(psnlComments, ['created_date']).reverse();
        
          },err =>{
            console.log(err);
            this.globals.showErrorMessage('Something went wrong. Please try later!');
          }
        );

      },err =>{
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      }
    );
   
  }
  // getPersonalComments(){
    
  // }

  questionChange(score,question,type){
    console.log(event)
    console.log(question)
    let selectedQuestion:any = question
    delete selectedQuestion. pulse_id 
    delete selectedQuestion.comment
    delete selectedQuestion.comment_type
    selectedQuestion.score = score.value
    
    if(type="Professional"){
     let goals = this.goalTypes.filter(X=>X.type_name == type )
     if(goals){
      selectedQuestion.question_type = goals[0].goal_type_id
     }
      if(this.answers.length > 0){
        let checkIfExists = this.answers.filter(x => x.question_id != selectedQuestion.question_id)
      if(checkIfExists){
        checkIfExists.push(selectedQuestion)
        this.answers =  checkIfExists
      }else{
        this.answers.push(selectedQuestion)
      }
  
      }else{
      this.answers.push(selectedQuestion)
      }
    }else{
      let goals = this.goalTypes.filter(X=>X.type_name == type )
      if(goals){
       selectedQuestion.question_type = goals[0].goal_type_id
      }
      if(this.personalAnswers.length > 0){
        let checkIfExists = this.answers.filter(x => x.question_id != selectedQuestion.question_id)
      if(checkIfExists){
        checkIfExists.push(selectedQuestion)
        this.personalAnswers =  checkIfExists
      }else{
        this.personalAnswers.push(selectedQuestion)
      }
  
      }else{
      this.personalAnswers.push(selectedQuestion)
      }
    }
  }

  submitProfessionalQuestions(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.updatePulseData(this.answers).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
        console.log("resdata",resdata)
        this.questions[1].score = 1
        this.questions[2].score = 1
        if(this.professionalComments){
          this.submitComments(this.professionalComments,this.professionalGoalId)
        }

      },err =>{
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      })
  }

  submitChoice(preference){
    this.commentPreference = preference

  }

  submitComments(comment,type){
    let obj:any = [
      {
        "enterprise_id": this.globals.currentEnterpriseId,
        "user_id": this.globals.currentUserId,
        "comment_type": type,
        "comment": comment,
        "user_name": this.globals.currentUserName
      }
    ]
    if(this.commentPreference == 'name'){
    this.enterpriseService.updatePulseComments(obj).subscribe(
      (resdata) => {
       console.log("resdata",resdata)
       this.professionalComments = ''
       this.personalComments =""
       this.getComments()
      },err =>{
        console.log(err);
        this.getComments()
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      })
   console.log("obj",obj)
  }
  else{
    let req = 
      {
        "enterprise_id": this.globals.currentEnterpriseId,
        "user_id": this.globals.currentUserId,
        "comment": comment,
        "name": this.globals.currentUserName
      }
   
    this.enterpriseService.updatePulseCommentsAnony(req).subscribe(
      (resdata) => {
        console.log("resdata",resdata)
        this.professionalComments ="";
        this.personalComments = "";
        this.getComments()
      },err =>{
        console.log(err);
        this.getComments()
        this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
  }
  
  //this.getPersonalComments()

  }

  submitPersonalQuestions(){
    console.log("fdfd",this.personalGoalId)
    this.globals.showLoading('Please wait');
    this.enterpriseService.updatePulseData(this.personalAnswers).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
      console.log("resdata",resdata)
      this.questions[0].score = 1
      if(this.personalAnswers){
        this.commentPreference = 'name'
        this.submitComments(this.personalComments,this.personalGoalId)
      }

      },err =>{
        console.log(err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
  }
}

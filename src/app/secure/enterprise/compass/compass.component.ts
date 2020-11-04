import { Component, OnInit, EventEmitter } from '@angular/core';
import Chart from 'chart.js';
import { GlobalService } from 'src/app/global/app.global.service';
import { EnterpriseService } from 'src/app/services';

@Component({
  selector: 'app-compass',
  templateUrl: './compass.component.html',
  styleUrls: ['./compass.component.css']
})
export class CompassComponent implements OnInit {

  Comments: any=[];
  comment = '';
  categories:any;
  overallAverage:any;
  labels:any;
  score:any;
  colors:any;
  window: any;
  CompassComments: any = {
    "enterprise_id": this.globals.currentEnterpriseId,
    "user_id": this.globals.currentUserId,
    "comment": "",
  };

  public realValue : number;
  public min : number = 0;
  public max : number = 100;

  constructor(private globals:GlobalService, private enterpriseService:EnterpriseService) { 
    this.getCompassComments()
  }

  ngOnInit() {
    this.getCompassScore();
    
  }

  get value() : number {
    return this.realValue;
  }

  set value(newValue : number) {
    this.realValue = newValue;
    if(this.realValue < this.min){
        this.realValue = undefined;
        setTimeout(() => {this.realValue = this.min;});
    }
    else if(this.realValue > this.max){
        this.realValue = undefined;
        setTimeout(() => {this.realValue = this.max;});
    }
  }

  getCompassComments(){
    this.globals.showLoading('Please wait');
    this.enterpriseService.getCompassComment(this.globals.currentEnterpriseId, this.globals.currentUserId).subscribe(
      (resdata) => {
        this.globals.hideLoading('Please wait');
        console.log(resdata); 
        this.Comments = resdata.body;
        console.log(this.Comments)
      },err => {
        console.log("err",err);
        this.globals.showErrorMessage('Something went wrong. Please try later!');
      }
    );
  }
  
  getCompassScore(){
    // this.enterpriseService.getCategories(this.globals.currentEnterpriseId, this.globals.currentUserId).subscribe(
    //   (resdata) => {
    //    // this.globals.hideLoading('Please wait');
    //     console.log("resdata",resdata); 
    //     resdata.body.forEach(element => {
    //       element.score = "";
           
    //      });
    //     this.categories = resdata.body
        
    //   }
    // );
    this.enterpriseService.getCompassScore(this.globals.currentEnterpriseId, this.globals.currentUserId).subscribe((res:any)=>{
      console.log("res",res)
      this.categories = res.body.filter(x => (x.name != "Miscellaneous" && x.name != "Define Category"))
      let sum = res.body.map(o => o.score).reduce((a, c) => { return a + c });
      this. overallAverage = sum / this.categories.length;
      this.colors = res.body.map(x => x.color)
      this.labels = res.body.map(x => x.name)
      this.score = res.body.map(x => x.score)
      console.log(" this.labels", this.labels)
      this.showChart();
    },err =>{
      console.log("err",err);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
  }

  showChart() {
    var ctx = (<any>document.getElementById('yudhatp-chart')).getContext('2d');
    if(this.window != undefined)
    this.window.destroy();
    this.window = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels :this.labels,
        datasets: [{
          backgroundColor: this.colors,
          data: this.score,
          borderWidth: 2
        }]
       },
       options: {
        legend: {
           display: false
        }
      }
    });
  }

  refreshPageData() {
		/* Page refresh method will be called here */
		console.log("Refresh Actions Page");
    this.getCompassComments();
    this.getCompassScore();
	}


  quickComment() {
    console.log("this.categories",this.categories)
    this.globals.showLoading('Please wait');
    this.enterpriseService.updateCompassScore(this.categories).subscribe((res:any)=>{
      this.globals.hideLoading('Please wait');
      console.log("res",res)
      this.refreshPageData();
    },err=>{
      this.globals.hideLoading('Please wait');
      console.log("err",err);
      this.globals.showErrorMessage('Something went wrong. Please try later!');
    })
     if(this.CompassComments.comment){
      console.log('item clicked');
      this.enterpriseService.addCompassComment(this.CompassComments).subscribe(
        (result) => {
          this.globals.hideLoading('Please wait');
          console.log(result);
          this.CompassComments.comment = "";
          this.refreshPageData();
        },err=>{
          console.log("err",err);
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
      );
     }
  }

  scoreChanged(event,index?){
    console.log("event",event)
    if(event <= 5){
      let sum = this.categories.map(o => o.score).reduce((a, c) => { return a + c });
      this. overallAverage = sum / this.categories.length;
    }else if(event > 5) {
      this.categories[index]['score'] = 5;
      let sum = this.categories.map(o => o.score).reduce((a, c) => { return a + c });
      this. overallAverage = sum / this.categories.length;
      return;
    }else if(event < 0){
      this.categories[index]['score'] = 0;
      let sum = this.categories.map(o => o.score).reduce((a, c) => { return a + c });
      this. overallAverage = sum / this.categories.length;
      return;
    }
  }

  inputScore(event: number,index?) {
    if (event > 5) {
      this.categories[index]['score'] = 5;
    } else if (event < 0) {
      this.categories[index]['score'] = 0;
    } else {
      this.categories[index]['score'] = event;
    }
  }

}

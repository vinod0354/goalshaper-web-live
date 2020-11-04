import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global/app.global.service';
import { EnterpriseService } from 'src/app/services';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  log:any;
  Page: number = 1;

  constructor(private enterpriseService:EnterpriseService,private globals:GlobalService) { }

  ngOnInit() {
      this.globals.showLoading('Please wait')
      this.enterpriseService.getPulseQuestionLog(this.globals.currentEnterpriseId).subscribe(
        (resdata) => {
          this.globals.hideLoading('Please wait');
          console.log("resdata",resdata)
          this.log = resdata.body
        },err =>{
          console.log(err);
          this.globals.showErrorMessage('Something went wrong. Please try later!');
        }
      );
    
  }

}

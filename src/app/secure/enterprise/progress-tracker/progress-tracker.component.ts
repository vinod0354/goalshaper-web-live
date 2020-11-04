import { Component, OnInit } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { Chart, ChartType, ChartOptions } from 'chart.js';
import { EventBrokerService } from 'ng-event-broker';
import { MultiDataSet, Label,Color } from 'ng2-charts';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ProgressHelpComponent } from './progress-help/progress-help.component';
import { ShareComponent } from './share/share.component';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.css']
})
export class ProgressTrackerComponent implements OnInit {
  doughnutChartLabels: Label[] = ['BMW', 'Ford', 'Tesla'];
  doughnutChartData: MultiDataSet = [
    [55, 25, 20]
  ];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartColors: Color[] = [
    {
      borderColor: 'white',
     
    },
  ];

  doughnutChartLabels2: Label[] = ['Green', 'Orange', 'yellow'];
  doughnutChartData2: MultiDataSet = [
    [50, 15, 35]
  ];
  doughnutChartType2: ChartType = 'doughnut';
  doughnutChartColors2: Color[] = [
    {
      borderColor: ['white'],
      borderWidth: [2, 1],
      backgroundColor: ['#57c7d4','#3bd949','#ffc107'],
    },
  ];



  doughnutChartLabels3: Label[] = ['Green', 'Orange', 'yellow'];
  doughnutChartData3: MultiDataSet = [
    [50, 15, 35]
  ];
  doughnutChartType3: ChartType = 'doughnut';


  doughnutChartColors3: Color[] = [
    {
      borderColor: 'white',
      backgroundColor: ['#57c7d4','#3bd949','#ffc107'],
    },
  ];

  doughnutChartOptions :ChartOptions = {
    cutoutPercentage: 75
  };

  doughnutChartLegend =false;

  modalRef: BsModalRef;
  TrackerHelpSubscription:Subscription;

  constructor(private modalService: BsModalService, private eventService: EventBrokerService, public pubsubSvc: NgxPubSubService) { }

  ngOnDestroy(): void {
		this.TrackerHelpSubscription.unsubscribe()
	}

  ngOnInit() {
    this.TrackerHelpSubscription = this.pubsubSvc.subscribe('TrackerHelp', (data: any) => { 
			this.HelpModal()
		})
  }

  HelpModal(){
    this.modalRef = this.modalService.show(
			ProgressHelpComponent,
			Object.assign({ class: 'gray modal-md' })
		);
  }

  openModal() {
    this.modalRef = this.modalService.show(
			ShareComponent,
			Object.assign({ class: 'gray modal-md' })
		);
  }

}

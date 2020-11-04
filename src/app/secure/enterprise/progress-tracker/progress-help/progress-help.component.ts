import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-progress-help',
  templateUrl: './progress-help.component.html',
  styleUrls: ['./progress-help.component.css']
})
export class ProgressHelpComponent implements OnInit {

  public modalType;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  closeModal(){
    this.bsModalRef.hide();
  }

}

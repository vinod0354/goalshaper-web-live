import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-action-help',
  templateUrl: './action-help.component.html',
  styleUrls: ['./action-help.component.css']
})
export class ActionHelpComponent implements OnInit {

  public modalType;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  closeModal(){
    this.bsModalRef.hide();
  }

}

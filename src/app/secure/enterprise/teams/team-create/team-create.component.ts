import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService, EnterpriseService } from 'src/app/services';
import { Constants } from 'src/app/global/app.global.constants';
import { GlobalService } from 'src/app/global/app.global.service';
import { AuthenticationService } from 'src/app/services';
import { TabHeadingDirective } from 'ngx-bootstrap';
import swal from 'sweetalert2';
import { UserLog } from 'src/app/models/userLog';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {


  private value: any = ['Athens'];
  private _disabledV: string = '0';
  public disabled: boolean = false;
  userLogs: UserLog = new UserLog();

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  public eventT: EventEmitter<any> = new EventEmitter();
  public individualData;
  public modalType;
  public teamMembers;
  public teamManagers;
  public teams;

  ButtonText: string = "Save";
  selectedTeamManager: any;
  allTeamManagers: any = [];
  allUsers: any = [];
  team_manager_id: any;
  selectedTeamId: any;


  teamInfo = {
    "name": "",
    "description": "",
    "email": "",
    "enterprise_id": 2,
    "team_manager_id": "",
    "team_members": []
  };

  constructor(private enterpriseService: EnterpriseService, public bsModalRef: BsModalRef, private globals: GlobalService, private modalService: BsModalService, private userService: UserService, private authenticationService: AuthenticationService) {
    this.teamInfo.enterprise_id = parseInt(this.globals.currentEnterpriseId);
  }

  ngOnInit() {
    console.log("All Teams");
    console.log(this.teams);

    if (this.modalType == 'EDIT') {
      let EditteamInfo = {
        "name": "",
        "description": "",
        "email": "",
        "enterprise_id": parseInt(this.globals.currentEnterpriseId),
        "team_manager_id": "",
        "team_members": []
      };

      console.log(this.individualData);
      EditteamInfo.name = this.individualData.name;
      EditteamInfo.email = this.individualData.email;
      EditteamInfo.description = this.individualData.description;
      EditteamInfo.enterprise_id = parseInt(this.individualData.enterprise_id);
      EditteamInfo.team_manager_id = this.individualData.teamManager.id;
      this.selectedTeamId = this.individualData.team_id;
      let dummyArray = [];
      for (let i = 0; i < this.individualData.teamMembers.length; i++) {

        dummyArray.push(this.individualData.teamMembers[i].id);
        if (i == this.individualData.teamMembers.length - 1) {
          EditteamInfo.team_members = dummyArray;
        }

      }


      console.log("EDIT TEAM INFO");
      console.log(EditteamInfo);

      this.teamInfo = EditteamInfo;

      this.ButtonText = "Update";
    } else {
      this.teamInfo = {
        "name": "",
        "description": "",
        "email": "",
        "enterprise_id": parseInt(this.globals.currentEnterpriseId),
        "team_manager_id": "",
        "team_members": []
      };

      this.ButtonText = "Save";

    }


  }

  triggerSelectedTeamManager() {
    console.log(this.teamInfo);

  }

  triggerSelectedusers() {
    console.log(this.teamInfo);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  createNewTeam() {

    console.log("this.teamInfo",this.teamInfo)
    if (this.modalType == 'EDIT') {

      if (this.teamInfo.team_manager_id == "") {
        this.teamInfo.team_manager_id = '0';
      }
      console.log(this.teamInfo);
      console.log(JSON.stringify(this.teamInfo));
      this.globals.showLoading('Please wait');
      this.enterpriseService.updateTeam(this.selectedTeamId, JSON.stringify(this.teamInfo)).subscribe(
        (result) => {
          console.log("UPDATED TEAM SUCCESSFULLY");
          console.log(result);
          // this.sweetAlertDisplay("Team updated successfully", true);
          this.eventT.emit('true');
          this.bsModalRef.hide();
          this.createUserLog('Team updated successfully for this TeamId: '+this.selectedTeamId,JSON.stringify(this.teamInfo));

        }, (err) => {
          console.log("POSTED TEAM FAILED");
          this.globals.showErrorMessage('Something went wrong. Please try later!');
          console.log(err);
        });
    } else {
      if (this.teamInfo.team_manager_id == "") {
        this.teamInfo.team_manager_id = '0';
      }
      console.log(this.teamInfo);
      console.log(JSON.stringify(this.teamInfo));

      let teamAlreadyExists = false;
      if (this.teams.length == 0) {
        this.createnewTeam();
      } else {
        for (let team = 0; team < this.teams.length; team++) {
          if (this.teamInfo.name == this.teams[team].name) {
            teamAlreadyExists = true;
          }
          if (this.teamInfo.team_manager_id == this.teams[team].teamManager.id) {
              this.globals.showErrorMessage('Selected team manager is already assigned. Please select another user');
              return
          }
          if (team == this.teams.length - 1) {
            if (!teamAlreadyExists) {
              console.log("Team  created");
              this.createnewTeam();
            } else {
              console.log("Team already exists");
              this.globals.showErrorMessage('Team Already Exists. Choose Different Name!');
            }
          }
        }
      }
    }
  }

  createnewTeam() {
    this.globals.showLoading('Please wait');
    this.enterpriseService.createTeam(JSON.stringify(this.teamInfo)).subscribe(
      (result) => {
        console.log("POSTED TEAM SUCCESSFULLY");
        console.log(result);
        // this.sweetAlertDisplay("Team created successfully", true);
        this.eventT.emit('true');
        this.bsModalRef.hide();
        this.createUserLog('Team created successfully.',JSON.stringify(this.teamInfo));

      }, (err) => {
        this.globals.showErrorMessage('Something went wrong. Please try later!');
        console.log("POSTED TEAM FAILED");
        console.log(err);

      });
  }



  sweetAlertDisplay(title, status) {

    if (status == true) {
      swal.fire({
        title: title,
        //html: '<span style="font-size:medium; color: #0072bb;">Enterprise will be listed in Home page</span>',
        allowEscapeKey: false,
        showCloseButton: false,
        imageUrl: 'assets/img/OK-48.png',
        allowOutsideClick: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      }).then((result) => {
        if (result.value) {
          this.eventT.emit('true');
          this.bsModalRef.hide();
        }
      });
    } else {

      swal.fire({
        title: title,
        html: '<span style="font-size:medium; color: #0072bb;">Something went wrong!! Try Again</span>',
        allowEscapeKey: false,
        showCloseButton: false,
        imageUrl: 'assets/img/OK-48.png',
        allowOutsideClick: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      }).then((result) => {
        if (result.value) {
          //Do Nothing
        }
      });
    }
  }

  createUserLog(activity, description){
    console.log(activity);
    console.log(description);
  
    this.userLogs.activity = activity;
    this.userLogs.description = description;
    this.userLogs.enterprise_id = this.globals.currentEnterpriseId;
    this.userLogs.user_id = this.globals.currentUserRoleId.toString();
    this.userService.createUserLog(this.userLogs).subscribe(
      (result) => {
          console.log('User Log Created');
          console.log(result);
      },(err)=>{
        console.log('user log creation error');
        console.log(err);
      });
  }


}

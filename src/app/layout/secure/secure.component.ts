import { Component, OnInit, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { Router, Event, NavigationEnd } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChangepasswordComponent } from 'src/app/secure/account/changepassword/changepassword.component';
import { AuthenticationService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import { EventBrokerService } from 'ng-event-broker';
import { Help } from 'src/app/events.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';


@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {

  public eventT: EventEmitter<any> = new EventEmitter();
  modalRef: BsModalRef;
  currentActiveMenu: string = null;
  loginUserName:string = '';
  loginUserRoleName: string = '';
  currentUserRoleId: number = 0;
  enterpriseInfoMenu:boolean = false;
  teamInfoMenu:boolean = false;
  dropMenu = false;
  dropMenuPowner = false;
  profilePhoto: string = '';
  selectedTab: any;
  constructor(
    private router:Router,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private globals: GlobalService,
    private eventService: EventBrokerService,
    public pubsubSvc: NgxPubSubService
    ) {
      /* Login Information Assignment */
      let loginUserInfo:any = localStorage.getItem('currentUser');
      if(loginUserInfo != null && loginUserInfo != undefined){
        loginUserInfo = JSON.parse(loginUserInfo);
        this.loginUserName = loginUserInfo.user.firstname+" "+loginUserInfo.user.lastname;
        this.loginUserRoleName = loginUserInfo.user.role_name;
        this.currentUserRoleId = parseInt(loginUserInfo.user.role_id);
        this.globals.currentUserRoleId = this.currentUserRoleId;
        if(this.globals.currentUserRoleId == 2){
          this.enterpriseInfoMenu = true;
          this.teamInfoMenu = false;
        }else if(this.globals.currentUserRoleId == 3){
          this.teamInfoMenu = true;
          this.enterpriseInfoMenu = false;
        }else{
          this.teamInfoMenu = false;
          this.enterpriseInfoMenu = false;
        }
        if(loginUserInfo.user.is_firsttime=='Y'){
          this.openChangePasswordComponent();
        }

        if(loginUserInfo.user.profile_photo != '' && loginUserInfo.user.profile_photo != null){
           /* Displays Original image */
           this.globals.userProfilePhoto = loginUserInfo.user.profile_photo;
           this.profilePhoto = this.globals.userProfilePhoto;
        }else{
          this.profilePhoto = this.globals.userProfilePhoto;
        }


      }


      /* Tracking current navigation path */
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          let currentURL = event.url.slice(1);
          let URLArray = currentURL.split('/');
          let activeMenu = URLArray.join('/');
          localStorage.setItem('currentMenu', activeMenu);


          if (activeMenu == 'home') {
            this.currentActiveMenu = 'menuPOHome';
            if(this.globals.currentUserRoleId != 1){
              this.authenticationService.logout();
            }

          }else if(activeMenu == 'features'){
            this.currentActiveMenu = 'menuPOEntpFeatures';
            if(this.globals.currentUserRoleId != 1){
              this.authenticationService.logout();
            }
          }else if(activeMenu == 'settings'){
            this.currentActiveMenu = 'menuPOSettings';
            if(this.globals.currentUserRoleId != 1){
              this.authenticationService.logout();
            }
          }else if(activeMenu == 'ent/home'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTHome';
          }else if(activeMenu == 'ent/goals'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTGoals';
          }else if(activeMenu == 'ent/objectives'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTObjectives';
          }else if(activeMenu == 'ent/action-categories'){
              if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
                this.authenticationService.logout();
              }
              this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/guiding-principles'){
              if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
                this.authenticationService.logout();
              }
            this.currentActiveMenu = 'menuENTGuiding';
          }else if(activeMenu == 'ent/compass'){
              if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
                this.authenticationService.logout();
              }
            this.currentActiveMenu = 'menuENTCompass';
          }else if(activeMenu == 'ent/progress-tracker'){
              if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
                this.authenticationService.logout();
              }
            this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/pulse'){
              if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
                this.authenticationService.logout();
              }
            this.currentActiveMenu = 'menuENTPulse';
          }else if(activeMenu == 'ent/pulse-qsn'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/teams'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/actions'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTActions';
          }else if(activeMenu == 'ent/calendar'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTCalendar';
          }else if(activeMenu == 'ent/individuals'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/settings'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTSettings';
          }else if(activeMenu == 'ent/reports'){
            if(this.globals.currentUserRoleId != 2 && this.globals.currentUserRoleId != 3 && this.globals.currentUserRoleId != 4){
              this.authenticationService.logout();
            }
            this.currentActiveMenu = 'menuENTReports';
          }else{
            this.currentActiveMenu = '';
          }

        }
      });
    }


  public RoleID;

  ngOnInit() {
    this.selectedTab = 'Action';
    this.eventService.registerEvent(Help.ActionHelp);
    
    this.RoleID=this.globals.currentUserRoleId;
    this.globals.profileupdated.subscribe((data) => {
    console.log("Triggered in secure");  
    console.log(data); 
    this.profilePhoto = data['user'].profile_photo;
    this.loginUserName = data['user'].firstname+" "+data['user'].lastname;
    this.loginUserRoleName = data['user'].role_name;
    });
  }

  signout(){
    this.authenticationService.logout();
  }

  openModal() {
    
    this.pubsubSvc.publishEvent(this.selectedTab+'Help')
  }

  navigateToHome(){
    if(this.currentUserRoleId == 1){
      this.router.navigateByUrl('/home');
    }else{
      this.router.navigateByUrl('/ent/actions');
    }
  }

  navigateToEnterpriseFeatures(){
    this.router.navigateByUrl('/features');
  }

  navigateToProductOwnerSettings(){
    this.router.navigateByUrl('/settings');
  }

  navigateToProfile(){
    this.router.navigateByUrl('/po/profile');
  }

  openChangePasswordComponent() {
		this.modalRef = this.modalService.show(ChangepasswordComponent);
  }

  /* Enterprise Admin Menu Section */
  navigateToEnterpriseGoals(){
    this.selectedTab = 'Compass';
    this.eventService.registerEvent(Help.CompassHelp);
    this.router.navigateByUrl('/ent/goals');
  }

  navigateToEnterpriseObjectives(){
    this.router.navigateByUrl('/ent/objectives');
  }

  navigateToEnterpriseCategories(){
    this.router.navigateByUrl('/ent/action-categories');
  }

  navigateToEnterpriseGuding(){
    this.router.navigateByUrl('/ent/guiding-principles');
  }

  navigateToEnterpriseCompass(){
    this.router.navigateByUrl('/ent/compass');
  }

  navigateToEnterprisePulse(){
    this.router.navigateByUrl('/ent/pulse');
  }

  navigateToEnterprisePulseStngs(){
    this.router.navigateByUrl('/ent/pulse-qsn');
  }

  navigateToEnterpriseProgress(){
    this.selectedTab = 'Tracker';
    this.router.navigateByUrl('/ent/progress-tracker');
  }

  navigateToEnterpriseTeams(){
    this.router.navigateByUrl('/ent/teams');
  }

  navigateToEnterpriseIndividuals(){
    this.router.navigateByUrl('/ent/individuals');
  }

  navigateToEnterpriseSettings(){
    this.router.navigateByUrl('/ent/settings');
  }

  navigateToEnterpriseIno(){
    this.router.navigateByUrl('/ent/info');
  }

  navigateToEnterpriseReports(){
    this.router.navigateByUrl('/ent/reports');
  }

  navigateToTeamInfo(){
    this.router.navigateByUrl('/ent/teaminfo');
  }

  navigateToEnterpriseActions(){
    this.selectedTab = 'Action';
   // this.eventService.registerEvent(Help.ActionHelp);
    this.router.navigateByUrl('/ent/actions');
  }

  navigateToEnterpriseCalendar(){
    this.router.navigateByUrl('/ent/calendar');
  }

  navigateToActionCategories(){
    this.router.navigateByUrl('/ent/action-categories');
  }
}

import { Injectable, Injector } from '@angular/core';
import serverConfiguration from '../../assets/config/server-config.json';
import apiConfiguration from '../../assets/config/api-config.json';
import { IServerConfig, IAPIConfig } from '../config/appconfig.model';
import swal from 'sweetalert2';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { getJSDocThisTag } from 'typescript';
import {Subject} from 'rxjs';
// @Injectable makes to available services in root level.
//@Injectable({providedIn:'root'})

@Injectable()
export class GlobalService {
    profileupdated = new Subject();
    public serverConfig: IServerConfig;
    public apiConfig: IAPIConfig;
    public pageSize: number = 10;
    public baseURL: string = '';
    public currentUserRoleId: number = 0;
    public currentEnterpriseId: string = '';
    public currentUserId : string='';
    public currentUserName : string ='';

    /* URLs */
    public loginUrl: string = '';
    public getAllEnterprisesUrl: string = '';
    public getAllEnterpriseCategoriesUrl: string = '';
    public getCountriesUrl: string = '';
    public getStatesUrl: string = '';
    public getCitiesUrl: string = '';
    public changePassword: string = '';
    public createEnterpriseUrl: string = '';
    public updateEnterpriseUrl: string = '';
    public createEnterpriseUserUrl: string = '';
    public mapEnterpriseUserIdUrl: string = '';
    public enterprisefeaturesmappingUrl: string= '';
    public deleteEnterpriseUrl: string = '';
    public mapEnterpriseFeaturesUrl: string = '';
    public togetEnterpriseInfoUrl : string = '';
    public refreshTokenUrl: string = '';
    public userRolesUrl: string ='';
    public createUserUrl: string = '';
    public updateUserUrl: string = '';
    public getUsersUrl: string = '';
    public deleteUserUrl: string = '';
    public getTeamUrl:string = '';
    public createTeamUrl:string = '';
    public updateTeamUrl:string = '';
    public deleteTeamUrl:string = '';
    public allUsersUrl: string = '';
    public getTeamManagers:string = '';
    public getTeamMembers:string = '';
    public getTeamManager:string = '';
    public userLogsUrl: string = '';
    public forgotPassword :string='';
    //Goals
    public getAllGoalsUrl:string = '';
    public createGoalUrl:string = '';
    public deleteGoalUrl:string = '';
    public updateGoalUrl:string = '';
    public getGoalsActivityUrl:string = '';
    public getMilestoneActivityUrl:string = '';
    public getGoalTypeUrl:string = '';
    public getGoalLevelUrl:string = '';
    public createMilestonesUrl:string = '';
    public createGoalsActivityUrl:string = '';
    public getMilestonesUrl:string = '';
    public updateMilestonesUrl:string = '';
    public createMilestonesActivityUrl : string = '';
    public goalTypeUrl:string='';
    public filterGoalDataUrl:string = '';

    //Objectives
    public getAllObjectivesUrl:string='';
    public createObjectiveUrl:string='';
    public updateObjectiveUrl:string='';
    public TogetallGoalsInObjectivePageUrl:string='';
    public TogetMilestonesUrl:string='';
    public ToDeleteObjectivesUrl:string='';
    public ToSaveObjectivesActivityUrl:string='';
    public TogetObjectivesActivityUrl:string='';
    public ToFilterbasedOnObjectivesUrl:string='';
    public ToFilterbasedOnDatesUrl : string='';

    //Home page
    public getHomeSummaryUrl:string = '';
    public getHomeSummaryDetailsUrl:string = '';

    //Actions
    public getCategoriesUrl:string = '';
    public getActionsUrl:string = '';
    public getActionPrioritiesUrl:string = '';
    public createActionsUrl:string = '';
    public updateActionsUrl:string = '';
    public deleteACtionsUrl:string = '';

    public createActionsCategoryUrl:string='';
    public updateActionsCategoryUrl:string='';
    public getActionsCategoryUrl:string='';
    public ToDeleteActionsCategoryUrl:string='';
    public createActionsCategoryDefaultUrl:string='';

    public userProfilePhoto:string = 'assets/img/account.svg';

    //Guding Principles
    public updategprinciplesUrl:string = '';
    public getgprinciplesUrl:string = '';

    //Compass
    public addCompasscommentUrl:string = '';
    public getCompasscommentUrl:string = '';
    public updateCompassScoreUrl:string = '';
    public getCompassScoreUrl:string = '';

    //pulse
    public getPulseQuestionsUrl:string ="";
    public updatePulseQuestionsUrl:string ="";
    public getPulseUserQuestionsUrl:string = "";
    public updatePulseDataUrl:string ="";
    public updatePulseCommentUrl :string ="";
    public updatePulseCommentAnonyUrl :string ="";
    public getPulseCommentsUrl:string ='';
    public getPulseCommentsAnonyUrl:string ="";
    public pulseLogUrl:string = "";

    constructor(private injector: Injector, private http: HttpClient) {

      var currentUser:any = localStorage.getItem('currentUser');
      console.log("curentuser",currentUser)
      if(currentUser != null && currentUser != undefined && currentUser != ''){
        currentUser = JSON.parse(currentUser);
        console.log("&&&&&&&&&&&");
        console.log(currentUser);
        this.currentUserRoleId = currentUser.user.role_id;
        this.currentEnterpriseId = currentUser.user.enterprise_id;
        this.currentUserId = currentUser.user.user_id;
        this.currentUserName = currentUser.user.firstname +' '+ currentUser.user.lastname
      }

      this.serverConfig = serverConfiguration;
      this.apiConfig = apiConfiguration;

      if(this.serverConfig.port == ''){
        this.baseURL =
        this.serverConfig.protocolType + '://' + this.serverConfig.host;
      }else{
        this.baseURL =
        this.serverConfig.protocolType + '://' + this.serverConfig.host + ':' + this.serverConfig.port;
      }
      this.loginUrl = this.baseURL + this.apiConfig.user.login;
      this.getAllEnterprisesUrl = this.baseURL + this.apiConfig.enterprise.getall;
      this.getAllEnterpriseCategoriesUrl = this.baseURL + this.apiConfig.enterprise.getallCategories;
      this.getStatesUrl = this.baseURL + this.apiConfig.geolocation.states;
      this.getCountriesUrl = this.baseURL + this.apiConfig.geolocation.countries;
      this.getCitiesUrl = this.baseURL + this.apiConfig.geolocation.cities;
      this.changePassword = this.baseURL +this.apiConfig.user.changePassowrd;
      this.createEnterpriseUrl = this.baseURL+this.apiConfig.enterprise.createEnterprise;
      this.createEnterpriseUserUrl = this.baseURL+this.apiConfig.user.createUser;
      this.updateEnterpriseUrl = this.baseURL+this.apiConfig.enterprise.updateEnterprise;
      this.mapEnterpriseUserIdUrl = this.baseURL+this.apiConfig.enterprise.insertDefaultDataForEnterprise;
      this.enterprisefeaturesmappingUrl= this.baseURL + this.apiConfig.enterprise.enterprisefeaturesmap;
      this.deleteEnterpriseUrl = this.baseURL + this.apiConfig.enterprise.deleteEnterprise;
      this.mapEnterpriseFeaturesUrl = this.baseURL + this.apiConfig.enterprise.mapEnterpriseFeatures;
      this.togetEnterpriseInfoUrl=this.baseURL + this.apiConfig.enterprise.togetEnterpriseInfo;
      this.refreshTokenUrl = this.baseURL + this.apiConfig.user.refreshToken;
      this.userRolesUrl = this.baseURL + this.apiConfig.user.roles;
      this.createUserUrl = this.baseURL + this.apiConfig.user.createUser;
      this.updateUserUrl = this.baseURL + this.apiConfig.user.updateUser;
      this.getUsersUrl = this.baseURL + this.apiConfig.user.getUsers;
      this.deleteUserUrl = this.baseURL + this.apiConfig.user.deleteUser;
      this.getTeamUrl = this.baseURL + this.apiConfig.team.getTeams;
      this.createTeamUrl = this.baseURL+ this.apiConfig.team.createTeam;
      this.updateTeamUrl = this.baseURL + this.apiConfig.team.updateTeam;
      this.deleteTeamUrl = this.baseURL + this.apiConfig.team.deleteTeam;
      this.allUsersUrl = this.baseURL + this.apiConfig.user.allUsers;
      this.getTeamManagers = this.baseURL +  this.apiConfig.team.getTeamManagers;
      this.getTeamMembers = this.baseURL + this.apiConfig.team.getTeamMembers;
      this.getTeamManager= this.baseURL + this.apiConfig.team.getTeamManager;
      this.forgotPassword = this.baseURL + this.apiConfig.user.forgotPassword;

      this.userLogsUrl = this.baseURL + this.apiConfig.user.userLogs;
      //Goals
      this.getAllGoalsUrl = this.baseURL + this.apiConfig.goals.getAllGoals;
      this.createGoalUrl = this.baseURL + this.apiConfig.goals.createGoal;
      this.deleteGoalUrl = this.baseURL + this.apiConfig.goals.deleteGoal;
      this.updateGoalUrl = this.baseURL + this.apiConfig.goals.updateGoal;
      this.getGoalsActivityUrl= this.baseURL + this.apiConfig.goals.getGoalsActivity;
      this.getMilestoneActivityUrl = this.baseURL + this.apiConfig.goals.getMilestonesActivity;
      this.getGoalLevelUrl = this.baseURL + this.apiConfig.goals.getGoalLevel;
      this.getGoalTypeUrl = this.baseURL + this.apiConfig.goals.getGoalType;
      this.createMilestonesUrl = this.baseURL + this.apiConfig.goals.createMilestones;
      this.createGoalsActivityUrl = this.baseURL + this.apiConfig.goals.createGoalsActivity;
      this.getMilestonesUrl = this.baseURL + this.apiConfig.goals.getMilestones;
      this.updateMilestonesUrl = this.baseURL + this.apiConfig.goals.updateMilestones;
      this.createMilestonesActivityUrl = this.baseURL + this.apiConfig.goals.createMilestoneActivity;
      this.goalTypeUrl=this.baseURL + this.apiConfig.goals.goalType;
      this.filterGoalDataUrl = this.baseURL + this.apiConfig.goals.filterGoalData


      //Objectives
      this.getAllObjectivesUrl=this.baseURL + this.apiConfig.objectives.getAllObjectives;
      this.createObjectiveUrl=this.baseURL+ this.apiConfig.objectives.createObjective;
      this.updateObjectiveUrl=this.baseURL+this.apiConfig.objectives.updateObjective;
      this.TogetallGoalsInObjectivePageUrl=this.baseURL + this.apiConfig.objectives.TogetallGoalsInObjectivePage;
      this.TogetMilestonesUrl=this.baseURL + this.apiConfig.objectives.TogetMilestones;
      this.ToDeleteObjectivesUrl=this.baseURL + this.apiConfig.objectives.ToDeleteObjectives;
      this.ToSaveObjectivesActivityUrl=this.baseURL + this.apiConfig.objectives.ToSaveObjectivesActivity;
      this.TogetObjectivesActivityUrl=this.baseURL + this.apiConfig.objectives.TogetObjectivesActivity;
      this.ToFilterbasedOnObjectivesUrl=this.baseURL + this.apiConfig.objectives.ToFilterbasedOnObjectives;
      this.ToFilterbasedOnDatesUrl=this.baseURL + this.apiConfig.objectives.ToFilterbasedOnDates;

      /* Get Home Page */
      this.getHomeSummaryUrl = this.baseURL + this.apiConfig.enterprise.homeSummary;
      this.getHomeSummaryDetailsUrl = this.baseURL + this.apiConfig.enterprise.homeSummaryDetails;

      //Actions
      this.getCategoriesUrl=this.baseURL + this.apiConfig.actions.getCategories;
      this.getActionsUrl=this.baseURL + this.apiConfig.actions.getActions;
      this.getActionPrioritiesUrl = this.baseURL + this.apiConfig.actions.getPriorities;
      this.createActionsUrl = this.baseURL + this.apiConfig.actions.createActions;
      this.updateActionsUrl = this.baseURL + this.apiConfig.actions.updateActions;
      this.deleteACtionsUrl = this.baseURL + this.apiConfig.actions.deleteActions;


      //Actions Cateogry
      this.createActionsCategoryUrl=this.baseURL + this.apiConfig.actions.createActionsCategory;
      this.updateActionsCategoryUrl=this.baseURL + this.apiConfig.actions.updateActionsCategory;
      this.getActionsCategoryUrl=this.baseURL + this.apiConfig.actions.getActionsCategory;
      this.ToDeleteActionsCategoryUrl=this.baseURL + this.apiConfig.actions.ToDeleteActionsCategory;
      this.createActionsCategoryDefaultUrl=this.baseURL + this.apiConfig.actions.createActionsDefaultCategory;

      //Guding Principles
      this.updategprinciplesUrl=this.baseURL + this.apiConfig.gprinciples.updategprinciples;
      this.getgprinciplesUrl=this.baseURL + this.apiConfig.gprinciples.getgprinciples;

      //Compass
      this.addCompasscommentUrl = this.baseURL + this.apiConfig.compass.addCompasscomment;
      this.getCompasscommentUrl = this.baseURL + this.apiConfig.compass.getCompass;
      this.updateCompassScoreUrl = this.baseURL + this.apiConfig.compass.updateCompassScore;
      this.getCompassScoreUrl = this.baseURL + this.apiConfig.compass.getCompassScore;

      // Pulse
      this.getPulseQuestionsUrl = this.baseURL + this.apiConfig.pulse.getPulseQuestions;
      this.updatePulseQuestionsUrl = this.baseURL + this.apiConfig.pulse.updatePulseQuestions;
      this.getPulseUserQuestionsUrl = this.baseURL + this.apiConfig.pulse.getPulseUserQuestions;
      this.updatePulseDataUrl = this.baseURL + this.apiConfig.pulse.updatePulseData
      this.updatePulseCommentUrl = this.baseURL + this.apiConfig.pulse.updatePulseComment
      this.updatePulseCommentAnonyUrl = this.baseURL + this.apiConfig.pulse.updatePulseCommentAnony
      this.getPulseCommentsUrl = this.baseURL + this.apiConfig.pulse.getPulseComments
      this.getPulseCommentsAnonyUrl = this.baseURL + this.apiConfig.pulse.getPulseCommentsAnony
      this.pulseLogUrl = this.baseURL + this.apiConfig.pulse.getPulseLog

    }

    showSuccessMessage(message){
        swal.fire({
          title:message,
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
        });
    }

    showErrorMessage(message){
        swal.fire({
          title:message,
          allowEscapeKey: false,
          showCloseButton: false,
          imageUrl: 'assets/img/Cancel-48.png',
          allowOutsideClick: false,
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          }
        });
    }

    showLoading(message){
        swal.fire({
          title:'',
          allowEscapeKey: false,
          allowOutsideClick: false,
          imageUrl: 'assets/img/Dual Ring-1s-64px.svg',
          showConfirmButton: false,
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          }
        });
    }

    hideLoading(message){
      swal.fire({
        title:'',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer:10,
        imageUrl: 'assets/img/Dual Ring-1s-64px.svg',
        showConfirmButton: false,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
    }

    showConfirm(message){
        swal.fire({
          title: message,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        })
    }


}

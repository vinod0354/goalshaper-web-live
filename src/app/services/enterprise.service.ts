import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Enterprise, EnterpriseCategory } from '../models/enterprise';
import { GlobalService } from '../global/app.global.service';

@Injectable({ providedIn: 'root' })
export class EnterpriseService {
  constructor(private http: HttpClient, private global: GlobalService) { }

  getAllEnterprises(): Observable<HttpResponse<Enterprise[]>> {
    return this.http.get<Enterprise[]>(this.global.getAllEnterprisesUrl, { observe: 'response' });
  }

  getEnterpriseCategories(): Observable<HttpResponse<EnterpriseCategory[]>> {
    return this.http.get<EnterpriseCategory[]>(this.global.getAllEnterpriseCategoriesUrl, { observe: 'response' });
  }

  createEnterprise(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createEnterpriseUrl, body, { observe: 'response' });
  }

  createUser(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createEnterpriseUserUrl, body, { observe: 'response' });
  }

  getAllEnterprisesMappingFeatures(): Observable<HttpResponse<Enterprise[]>> {
    return this.http.get<Enterprise[]>(this.global.enterprisefeaturesmappingUrl, { observe: 'response' });
  }

  updateEnterprise(enterpriseId, body): Observable<HttpResponse<any>> {
    let inputUrl = this.global.updateEnterpriseUrl;
    inputUrl = inputUrl.replace('{enterprise_id}', enterpriseId);
    return this.http.put<any>(inputUrl, body, { observe: 'response' });
  }

  mapEnterpriseUser(enterpriseId, userId): Observable<HttpResponse<any>> {

    let inputUrl = this.global.mapEnterpriseUserIdUrl;
    inputUrl = inputUrl.replace('{enterprise_id}', enterpriseId);
    inputUrl = inputUrl.replace('{user_id}', userId);

    return this.http.post<any>(inputUrl, { observe: 'response' });
  }

  mapEnterpriseFeatures(enterpriseId, featureList): Observable<HttpResponse<any>> {
    let url = this.global.mapEnterpriseFeaturesUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    return this.http.post<any>(url, featureList, { observe: 'response' });
  }

  deleteEnterprise(enterpriseId): Observable<HttpResponse<any>> {
    let deleteUrl = this.global.deleteEnterpriseUrl;
    deleteUrl = deleteUrl.replace('{enterprise_id}', enterpriseId);
    console.log('Delete URL:' + deleteUrl);
    return this.http.delete<any>(deleteUrl, { observe: 'response' });
  }

  togetEnterpriseIngo(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.togetEnterpriseInfoUrl + "/" + enterpriseId;
    return this.http.get<any>(url, { observe: 'response' });
  }

  createTeam(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createTeamUrl, body, { observe: 'response' });
  }

  getAllTeams(enterpriseId): Observable<HttpResponse<any>> {
    let getTeamsUrl = this.global.getTeamUrl;
    getTeamsUrl = getTeamsUrl.replace('{enterprise_id}', enterpriseId);
    return this.http.get<any>(getTeamsUrl, { observe: 'response' });
  }

  deleteTeam(teamId): Observable<HttpResponse<any>> {
    let deleteTeamUrl = this.global.deleteTeamUrl;
    deleteTeamUrl = deleteTeamUrl.replace('{team_id}', teamId);
    console.log('Delete URL:' + deleteTeamUrl);
    return this.http.delete<any>(deleteTeamUrl, { observe: 'response' });
  }

  updateTeam(teamId, body): Observable<HttpResponse<any>> {
    let updateTeamUrl = this.global.updateTeamUrl;
    updateTeamUrl = updateTeamUrl.replace('{team_id}', teamId);
    return this.http.put<any>(updateTeamUrl, body, { observe: 'response' });
  }

  getTeamManagers(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.getTeamManagers;
    url = url.replace('{enterprise_id}', enterpriseId);
    return this.http.get<any>(url, { observe: 'response' });
  }

  getTeamMembers(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.getTeamMembers;
    url = url.replace('{enterprise_id}', enterpriseId);
    return this.http.get<any>(url, { observe: 'response' });
  }
  togetTeamMangerInfo(id): Observable<HttpResponse<any>> {
    let url = this.global.getTeamManager;
    url = url.replace('{enterprise_id}', id);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }

  // Goals
  getAllGoals(enterpriseId, pageNumber, pageSize, sortColumn, sortOrder,userId): Observable<HttpResponse<any>> {
    let url = this.global.getAllGoalsUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{pageNumber}', pageNumber);
    url = url.replace('{pageSize}', pageSize);
    url = url.replace('{sortColumn}', sortColumn);
    url = url.replace('{sortOrder}', sortOrder);
    url = url.replace('{userId}',userId);
    console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  createGoal(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createGoalUrl, body, { observe: 'response' });
  }

  deleteGoal(enterpriseId, goalId): Observable<HttpResponse<any>> {
    let url = this.global.deleteGoalUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{goal_id}', goalId);
    console.log("Final URl : ");
    console.log(url);
    return this.http.delete<any>(url, { observe: 'response' });
  }

  updateGoal(goalId, body): Observable<HttpResponse<any>> {
    let url = this.global.updateGoalUrl;
    url = url.replace('{goal_id}', goalId);
    return this.http.put<any>(url, body, { observe: 'response' });
  }

//10.ToFilterbasedon dates
  filterGoalData(currentEnterpriseId,pageNumber, pageSize,sortColumn, sortOrder,userId,searchColumn,searchValue): Observable<HttpResponse<any>> {
  console.log("ghdnfdjnjs")
  let url = this.global.filterGoalDataUrl;
  // var dates=start_date;
  url = url.replace('{enterprise_id}', currentEnterpriseId);
  url = url.replace('{userId}', userId);
  url = url.replace('{searchColumn}', searchColumn);
  url = url.replace('{sortColumn}', sortColumn);
  url = url.replace('{sortOrder}', sortOrder);
  url = url.replace('{searchValue}', searchValue);
  url = url.replace('{pageNumber}',pageNumber);
  url = url.replace('{pageSize}',pageSize);
  console.log(url);


  return this.http.get<any>(url, { observe: 'response' });
}
  


  //Objectives
  // 1.ToloadAllObjectives
  TogetAllObjectivesService(enterpriseId,userId, pageNumber, pageSize, sortColumn, sortOrder): Observable<HttpResponse<any>> {
    let url = this.global.getAllObjectivesUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{userId}', userId);
    url = url.replace('{pageNumber}', pageNumber);
    url = url.replace('{pageSize}', pageSize);
    url = url.replace('{sortColumn}', sortColumn);
    url = url.replace('{sortOrder}', sortOrder);
    console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  // 2.ToCreateObjectives
  createObjective(data): Observable<HttpResponse<any>> {
    console.log(data)
    let url = this.global.createObjectiveUrl;
    // url = url.replace('{enterprise_id}', '1');
    console.log(url);
    return this.http.post<any>(url, data, { observe: 'response' });
  }

  // 3.ToUpdateObjectives
  updateObjective(data, id): Observable<HttpResponse<any>> {
    console.log(data)
    console.log(id)
    let url = this.global.updateObjectiveUrl;
    url = url.replace('{objectiveId}', id);
    console.log(url);
    return this.http.put<any>(url, data, { observe: 'response' });
  }

  // 4.TogettheGoalInfo
  getAllGoalsInfoObjectivePage(id,userId): Observable<HttpResponse<any>> {
    console.log(id)
    let url = this.global.TogetallGoalsInObjectivePageUrl;
    console.log(url);
    url = url.replace('{enterprise_id}', id);
    url = url.replace('{userId}', userId);
    return this.http.get<any>(url, { observe: 'response' });
  }

  // 5.ToloadMilesStones BasedOn Goal Selection
  ToloadMilestonesService(enterprise__Id, goal__ID): Observable<HttpResponse<any>> {
    let url = this.global.TogetMilestonesUrl;
    console.log(url);
    url = url.replace('{enterpriseId}', enterprise__Id);
    url = url.replace('{goalId}', goal__ID);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }

  // 6.ToDelete Objectives
  deleteObjective(enterpirsID, ObjectivID): Observable<HttpResponse<any>> {
    let url = this.global.ToDeleteObjectivesUrl;
    console.log(url);
    url = url.replace('{enterpriseId}', enterpirsID);
    url = url.replace('{objectiveId}', ObjectivID);
    console.log(url)
    return this.http.delete<any>(url, { observe: 'response' });
  }


  // 7.To Save Objectives Activity
  ToSaveObjectiveActivityService(ActivityInfo): Observable<HttpResponse<any>> {
    let url = this.global.ToSaveObjectivesActivityUrl;
    console.log(ActivityInfo)
    console.log(url)
    return this.http.post<any>(url, ActivityInfo, { observe: 'response' });
  }


  // 8.To Get objectives activity to be saved
  TogetObjectivesActivitiesService(activityEnter_ID, activityObjective_Id): Observable<HttpResponse<any>> {
    let url = this.global.TogetObjectivesActivityUrl;
    url = url.replace('{enterpriseId}', activityEnter_ID);
    url = url.replace('{objectiveId}', activityObjective_Id);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }
  //9.Toload objective type
  ToloadobjectivetypeServices(objective_enterpriseID): Observable<HttpResponse<any>> {
    let url = this.global.goalTypeUrl;
    url = url.replace('{enterprise_id}', objective_enterpriseID);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }
  //10.ToFilterbasedOnObjectivesUrl
  ToFilterbasedOnObjective(currentEnterpriseId,currentUserId,searchColumn, searchValue,pageNumber, pageSize,sortOrder): Observable<HttpResponse<any>> {
    console.log("ghdnfdjnjs")
    let url = this.global.ToFilterbasedOnObjectivesUrl;
    // var dates=start_date;
    url = url.replace('{enterpriseId}', currentEnterpriseId);
    url = url.replace('{userId}', currentUserId);
    url = url.replace('{searchColumn}', searchColumn);
    url = url.replace('{searchValue}', searchValue);
    url = url.replace('{pageNumber}', pageNumber);
    url = url.replace('{pageSize}', pageSize);
    url = url.replace('{sortColumn}', searchColumn);
    url = url.replace('{sortOrder}', sortOrder);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }

  //10.ToFilterbasedon dates
  ToFilterbasedOnDate(currentEnterpriseId,currentUserId,searchColumn, start_date,end_date,pageNumber, pageSize,sortOrder): Observable<HttpResponse<any>> {
    console.log("ghdnfdjnjs")
    let url = this.global.ToFilterbasedOnDatesUrl;
    // var dates=start_date;
    url = url.replace('{enterpriseId}', currentEnterpriseId);
    url = url.replace('{userId}', currentUserId);
    url = url.replace('{searchColumn}', searchColumn);
    url = url.replace('{start_date}', start_date);
    url = url.replace('{end_date}', end_date);
    url = url.replace('{pageNumber}', pageNumber);
    url = url.replace('{pageSize}', pageSize);
    url = url.replace('{sortColumn}', searchColumn);
    url = url.replace('{sortOrder}', sortOrder);
    console.log(url)
    return this.http.get<any>(url, { observe: 'response' });
  }


  // End of the Objective API services
  // ============================================

  getSummaryInfo(enterpriseId,userId): Observable<HttpResponse<any[]>> {
    let Url = this.global.getHomeSummaryUrl;
    console.log(Url);
    Url = Url.replace('{enterprise_id}', enterpriseId);
    Url = Url.replace('{userId}', userId);
    console.log(Url);
    return this.http.get<any[]>(Url, { observe: 'response' });
  }


  getGoalsActivity(enterpriseId, goalId): Observable<HttpResponse<any>> {
    let url = this.global.getGoalsActivityUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{goal_id}', goalId);
    console.log("Final URl : ");
    console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  getMilesstonesActivity(enterpriseId, goalId): Observable<HttpResponse<any>> {
    let url = this.global.getMilestoneActivityUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{goal_id}', goalId);
    console.log("Final URl : ");
    console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }


  getSummaryDetailsInfo(enterpriseId,userId): Observable<HttpResponse<any[]>> {
    let Url = this.global.getHomeSummaryDetailsUrl;
    Url = Url.replace('{enterprise_id}', enterpriseId);
    Url = Url.replace('{userId}', userId);
    console.log(Url);
    return this.http.get<any[]>(Url, { observe: 'response' });
  }

  getGoalLevels(enterpriseId): Observable<HttpResponse<any[]>> {
    let Url = this.global.getGoalLevelUrl;
    Url = Url.replace('{enterprise_id}', enterpriseId);
    console.log("Get Levels....");
    console.log(Url);
    return this.http.get<any[]>(Url, { observe: 'response' });
  }

  getGoalTypes(enterpriseId): Observable<HttpResponse<any[]>> {
    let Url = this.global.getGoalTypeUrl;
    Url = Url.replace('{enterprise_id}', enterpriseId);
    console.log(Url);
    return this.http.get<any[]>(Url, { observe: 'response' });
  }

  createMilestones(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createMilestonesUrl, body, { observe: 'response' });
  }

  updateMilestones(milestoneNumber, body): Observable<HttpResponse<any>> {
    let url = this.global.updateMilestonesUrl;
    url = url.replace('{milestone_number}', milestoneNumber);
    return this.http.put<any>(url, body, { observe: 'response' });
  }

  createGoalsActivity(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createGoalsActivityUrl, body, { observe: 'response' });
  }

  getMilestones(enterpriseId, goalId): Observable<HttpResponse<any>> {
    let url = this.global.getMilestonesUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{goal_id}', goalId);
    console.log("Final URl : ");
    console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  createMilestoneActivity(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createMilestonesActivityUrl, body, { observe: 'response' });
  }

  // Actions
  getCategories(enterpriseId,userId): Observable<HttpResponse<any>> {
    let url = this.global.getCategoriesUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{user_id}',userId);

     console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  getActions(enterpriseId,userId,categoryId): Observable<HttpResponse<any>> {
    let url = this.global.getActionsUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
    url = url.replace('{user_id}',userId);
    url = url.replace('{category_id}',categoryId);
     console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  getpriorities(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.getActionPrioritiesUrl;
    url = url.replace('{enterprise_id}', enterpriseId);
     console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  createAction(body): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.global.createActionsUrl, body, { observe: 'response' });
  }

  updateAction(actionId, body): Observable<HttpResponse<any>> {
    let url = this.global.updateActionsUrl;
    url = url.replace('{action_id}', actionId);
    return this.http.put<any>(url, body, { observe: 'response' });
  }

  deleteAction(enterpriseId,actionId): Observable<HttpResponse<any>> {
    let url = this.global.deleteACtionsUrl;
    url = url.replace('{action_id}', actionId);
    url = url.replace('{enterprise_id}', enterpriseId);
    return this.http.delete<any>(url, { observe: 'response' });
  }





  // Actions
  // 1.To Create Action Category
  createActionCategory(data): Observable<HttpResponse<any>>{
    console.log(data)
    let url = this.global.createActionsCategoryUrl;
    console.log(url);
    return this.http.post<any>(url,data, { observe: 'response' });
  }

  // 2.To Update Actions
  updateActionCategory(data,category_id): Observable<HttpResponse<any>>{
    console.log(data)
    console.log(category_id)
    let url = this.global.updateActionsCategoryUrl;
    url = url.replace('{categoryId}', category_id);
    console.log(url);
    return this.http.put<any>(url,data, { observe: 'response' });
  }
  // 3.To Delete Actions
  deleteActionCategory(enterpriseId,userId,category_id): Observable<HttpResponse<any>>{
    let url = this.global.ToDeleteActionsCategoryUrl;
    console.log(url);
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    url = url.replace('{categoryId}', category_id);
    console.log(url)
    return this.http.delete<any>(url,{ observe: 'response' });
  }
  // 4.TO Get Action Category
  getActionCategory(enterpriseId, userId, pageNumber, pageSize): Observable<HttpResponse<any>> {
    let url = this.global.getActionsCategoryUrl;
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    url = url.replace('{pageNumber}', pageNumber);
    url = url.replace('{pageSize}', pageSize);
     console.log(url);
    return this.http.get<any>(url, { observe: 'response' });
  }

  createActionsCategorydefault(enterpriseId, userId): Observable<HttpResponse<any>> {
    let url = this.global.createActionsCategoryDefaultUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
     console.log(url);
    return this.http.post<any>(url, { observe: 'response' });
  }

  getgprinciples(enterpriseId, userId): Observable<HttpResponse<any>> {
    let url = this.global.getgprinciplesUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
      console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }

  updateprinciples(data): Observable<HttpResponse<any>> {
    let url = this.global.updategprinciplesUrl
    console.log(url);
    return this.http.put<any>(url,data, { observe: 'response' });
  }

  //Compass
  addCompassComment(data): Observable<HttpResponse<any>> {
    let url = this.global.addCompasscommentUrl
    console.log(url);
    return this.http.post<any>(url,data, { observe: 'response' })
  }

  getCompassComment(enterpriseId, userId): Observable<HttpResponse<any>> {
    let url = this.global.getCompasscommentUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }

  getCompassScore(enterpriseId, userId): Observable<HttpResponse<any>> {
    let url = this.global.getCompassScoreUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }

  updateCompassScore(data): Observable<HttpResponse<any>>{
    let url = this.global.updateCompassScoreUrl
    console.log(url);
    return this.http.put<any>(url,data, { observe: 'response' });
  }

  // Pulse 
  getPulseQuestions(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.getPulseQuestionsUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }
  
  updatePulseQuestions(data): Observable<HttpResponse<any>>{
    let url = this.global.updatePulseQuestionsUrl
    console.log(url);
    return this.http.put<any>(url,data, { observe: 'response' });
  }
  getPulseUserQuestions(enterpriseId,userId): Observable<HttpResponse<any>> {
    let url = this.global.getPulseUserQuestionsUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }

  updatePulseData(data): Observable<HttpResponse<any>>{
    let url = this.global.updatePulseDataUrl
    console.log(url);
    return this.http.post<any>(url,data, { observe: 'response' });
  }

  updatePulseComments(data): Observable<HttpResponse<any>>{
    let url = this.global.updatePulseCommentUrl
    console.log(url);
    return this.http.post<any>(url,data, { observe: 'response' });
  }
  updatePulseCommentsAnony(data): Observable<HttpResponse<any>>{
    let url = this.global.updatePulseCommentAnonyUrl
    console.log(url);
    return this.http.post<any>(url,data, { observe: 'response' });
  }
  getPulseComments(enterpriseId,userId): Observable<HttpResponse<any>> {
    let url = this.global.getPulseCommentsUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    url = url.replace('{userId}', userId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }

  getPulseCommentsAnony(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.getPulseCommentsAnonyUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }
  getPulseQuestionLog(enterpriseId): Observable<HttpResponse<any>> {
    let url = this.global.pulseLogUrl
    url = url.replace('{enterpriseId}', enterpriseId);
    console.log(url);
    return this.http.get<any[]>(url, {observe: 'response'});
  }
}
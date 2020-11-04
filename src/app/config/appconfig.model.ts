import { InstallPackageOptions } from 'typescript';

export interface IServerConfig {
	protocolType: string;
	host: string;
	port: string;
	version: string;
}

export interface IUser {
	forgotPassword: string;
    changePassowrd: string;
	login: string;
	refreshToken: string;
	createUser: string;
	roles: string;
	updateUser: string;
	getUsers: string;
	deleteUser: string;
	allUsers: string;
	userLogs: string;
}

export interface ITeam{
	getTeams:string;
	createTeam:string;
	updateTeam:string;
	deleteTeam:string;
	getTeamManager:string;
	getTeamManagers:string;
	getTeamMembers:string;
}

export interface IEnterprise {
	getall: string;
	getallCategories: string;
	createEnterprise: string;
	updateEnterprise: string;
	insertDefaultDataForEnterprise: string;
	enterprisefeaturesmap: string;
	deleteEnterprise: string;
	mapEnterpriseFeatures: string;
	togetEnterpriseInfo:string;
	homeSummary: string;
	homeSummaryDetails: string;
}

export interface IGeolocation{
	countries: string;
	states: string;
	cities: string;
}

export interface IGoals{
	getAllGoals:string;
	createGoal:string;
	deleteGoal:string;
	updateGoal:string;
	getGoalsActivity:string;
	getMilestonesActivity:string;
    getGoalType:string;
    getGoalLevel:string;
    createMilestones:string;
	createGoalsActivity:string;
	getMilestones:string;
	updateMilestones:string;
	createMilestoneActivity:string;
	goalType:string;
	filterGoalData:string;

}

export interface IObjectives{
	getAllObjectives:string;
	createObjective:string;
	updateObjective:string;
	TogetallGoalsInObjectivePage:string;
	TogetMilestones:string;
	ToDeleteObjectives:string;
	ToSaveObjectivesActivity:string;
	TogetObjectivesActivity:string;
	ToFilterbasedOnObjectives:string;
	ToFilterbasedOnDates:string;

}

export interface IActions{
	getCategories:string;
	getActions:string;
	getPriorities:string;
    createActions:string;
    updateActions:string;
    deleteActions:string;

	createActionsCategory:string;
	updateActionsCategory:string;
	getActionsCategory:string;
	ToDeleteActionsCategory:string;
	createActionsDefaultCategory:string;
}

export interface Igprinciples{
	updategprinciples:string;
	getgprinciples:string;
}

export interface Icompass{
	getCompass:string;
	addCompasscomment:string;
	updateCompassScore:string;
	getCompassScore:string;
}

export interface Ipulse{
	getPulseQuestions:string;
	updatePulseQuestions:string;
	getPulseUserQuestions:string;
	updatePulseData:string
	updatePulseComment:string
	updatePulseCommentAnony:string
	getPulseComments:string
	getPulseCommentsAnony:string
	getPulseLog:string
}

export interface IAPIConfig {
    user: IUser;
	enterprise: IEnterprise;
	geolocation: IGeolocation;
	team:ITeam;
	goals:IGoals;
	objectives:IObjectives;
	actions:IActions;
	gprinciples:Igprinciples;
	compass:Icompass;
	pulse:Ipulse;
}

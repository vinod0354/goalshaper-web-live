import { HomeComponent } from './../../secure/home';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../helpers/auth.guard';
import { TrendComponent } from '../../secure/trend/trend.component';
import { SettingsComponent } from '../../secure/settings/settings.component';
import { FeaturesComponent } from '../../secure/features/features.component';
import { PoprofileComponent } from '../../secure/account/poprofile/poprofile.component';
import { EnterpriseHomeComponent } from '../../secure/enterprise/enterprise-home/enterprise-home.component';
import { GoalsComponent } from '../../secure/enterprise/goals/goals.component';
import { ObjectivesComponent } from '../../secure/enterprise/objectives/objectives.component';
import { TeamsComponent } from '../../secure/enterprise/teams/teams.component';
import { EnterpriseSettingsComponent } from '../../secure/enterprise/enterprise-settings/enterprise-settings.component';
import { IndividualComponent } from '../../secure/enterprise/individual/individual.component';
import { EnterpriseInfoComponent } from '../../secure/enterprise/enterprise-info/enterprise-info.component';
import { ReportsComponent } from '../../secure/enterprise/reports/reports.component';
import { TeamInfoComponent } from '../../secure/enterprise/team-info/team-info.component';
import { ActionsComponent } from '../../secure/enterprise/actions/actions.component';
import { ActionsNewComponent } from 'src/app/secure/enterprise/actions/actions-new/actions-new.component';
import { ActionCategoriesComponent } from '../../secure/enterprise/action-categories/action-categories.component';
import { GuidingPrinciplesComponent } from 'src/app/secure/enterprise/guiding-principles/guiding-principles.component';
import { CompassComponent } from 'src/app/secure/enterprise/compass/compass.component';
import { ProgressTrackerComponent } from 'src/app/secure/enterprise/progress-tracker/progress-tracker.component';
import { PulseComponent } from 'src/app/secure/enterprise/pulse/pulse.component';
import { PulseQestionComponent } from 'src/app/secure/enterprise/pulse-qestion/pulse-qestion.component';
import { LogComponent } from 'src/app/secure/enterprise/pulse-qestion/log/log.component';
import { CalendarComponent } from 'src/app/secure/enterprise/calendar/calendar.component';


export const SECURE_ROUTES: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'trend', component: TrendComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'features', component: FeaturesComponent, canActivate: [AuthGuard] },
    { path: 'po/profile', component: PoprofileComponent, canActivate: [AuthGuard] },
    { path: 'ent/home', component: EnterpriseHomeComponent, canActivate: [AuthGuard] },
    { path: 'ent/goals', component: GoalsComponent, canActivate: [AuthGuard] },
    { path: 'ent/objectives', component: ObjectivesComponent, canActivate: [AuthGuard] },
    // { path: 'ent/actions', component: ActionsComponent, canActivate: [AuthGuard] },
    { path: 'ent/actions', component: ActionsNewComponent, canActivate: [AuthGuard] },
    { path: 'ent/calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: 'ent/teams', component: TeamsComponent, canActivate: [AuthGuard] },
    { path: 'ent/settings', component: EnterpriseSettingsComponent, canActivate: [AuthGuard] },
    { path: 'ent/individuals', component: IndividualComponent, canActivate: [AuthGuard] },
    { path: 'ent/info', component: EnterpriseInfoComponent, canActivate: [AuthGuard] },
    { path: 'ent/reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'ent/teaminfo', component: TeamInfoComponent, canActivate: [AuthGuard] },
    { path: 'ent/action-categories', component: ActionCategoriesComponent, canActivate: [AuthGuard] },
    { path: 'ent/guiding-principles',component: GuidingPrinciplesComponent, canActivate: [AuthGuard] },
    { path:  'ent/compass', component: CompassComponent, canActivate: [AuthGuard]},
    { path:  'ent/progress-tracker', component: ProgressTrackerComponent, canActivate: [AuthGuard]},
    { path:  'ent/pulse', component: PulseComponent, canActivate: [AuthGuard]},
    { path:  'ent/pulse-qsn', component: PulseQestionComponent, canActivate: [AuthGuard]},
    { path:  'ent/pulse-log', component: LogComponent, canActivate: [AuthGuard]},
];
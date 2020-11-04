import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GlobalService } from './global/app.global.service';
import { EnterpriseService } from './services/enterprise.service';
import { GeolocationService } from './services/geolocation.service';
import {ShareService} from './services/share.service'

import { SearchPipe } from './pipes/searchPipe';
import { SortPipe } from './pipes/sortPipe';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SecureComponent } from './layout/secure';
import { PublicComponent } from './layout/public';
import { HomeComponent } from './secure/home';
import { LoginComponent } from './public/login';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers/auth.guard';
import { HttpInterceptors } from './helpers/http.interceptors';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TrendComponent } from './secure/trend/trend.component';
import { ModalModule, TooltipModule, PaginationModule, TypeaheadModule } from 'ngx-bootstrap';
import { ChangepasswordComponent } from './secure/account/changepassword/changepassword.component';
import { CreateComponent } from './secure/home/create/create.component';
import { FeaturesComponent } from './secure/features/features.component';
import { SettingsComponent } from './secure/settings/settings.component';
import { PoprofileComponent } from './secure/account/poprofile/poprofile.component';
import { EnterpriseHomeComponent } from './secure/enterprise/enterprise-home/enterprise-home.component';
import { GoalsComponent } from './secure/enterprise/goals/goals.component';
import { ObjectivesComponent } from './secure/enterprise/objectives/objectives.component';
import { TeamsComponent } from './secure/enterprise/teams/teams.component';
import { EnterpriseSettingsComponent } from './secure/enterprise/enterprise-settings/enterprise-settings.component';
import { IndividualComponent } from './secure/enterprise/individual/individual.component';
import { IndividualCreateComponent } from './secure/enterprise/individual/individual-create/individual-create.component';
import { TeamCreateComponent } from './secure/enterprise/teams/team-create/team-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { EnterpriseInfoComponent } from './secure/enterprise/enterprise-info/enterprise-info.component';
import { ReportsComponent } from './secure/enterprise/reports/reports.component';
import { GoalsCreateComponent } from './secure/enterprise/goals/goals-create/goals-create.component';
import { ObjectivesCreateComponent } from './secure/enterprise/objectives/objectives-create/objectives-create.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { GoalsActivityComponent } from './secure/enterprise/goals/goals-activity/goals-activity.component';
import { ObjectivesActivityComponent } from './secure/enterprise/objectives/objectives-activity/objectives-activity.component';
import { TeamInfoComponent } from './secure/enterprise/team-info/team-info.component';
import { ActionsComponent } from './secure/enterprise/actions/actions.component';
import { ActionsCreateComponent } from './secure/enterprise/actions/actions-create/actions-create.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ActionsNewComponent } from './secure/enterprise/actions/actions-new/actions-new.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ActionCategoriesComponent } from './secure/enterprise/action-categories/action-categories.component';
import { CreateCategoriesComponent } from './secure/enterprise/action-categories/create-categories/create-categories.component';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
import { FocusDirective } from './focus.directive';
import { GuidingPrinciplesComponent } from './secure/enterprise/guiding-principles/guiding-principles.component';
import { CompassComponent } from './secure/enterprise/compass/compass.component';
import { ProgressTrackerComponent } from './secure/enterprise/progress-tracker/progress-tracker.component';
import { ChartsModule } from 'ng2-charts';
import { PulseComponent } from './secure/enterprise/pulse/pulse.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatTabsModule } from '@angular/material';
import { AddDateComponent } from './secure/enterprise/actions/add-date/add-date.component';
import { ShareComponent } from './secure/enterprise/progress-tracker/share/share.component';
import { PulseQestionComponent } from './secure/enterprise/pulse-qestion/pulse-qestion.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UpdateQsnComponent } from './secure/enterprise/pulse-qestion/update-qsn/update-qsn.component';
import { SplitPipe } from './split.pipe';
import { EventBrokerModule } from 'ng-event-broker';
import { ActionHelpComponent } from './secure/enterprise/actions/action-help/action-help.component';
import { LogComponent } from './secure/enterprise/pulse-qestion/log/log.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { ProgressHelpComponent } from './secure/enterprise/progress-tracker/progress-help/progress-help.component';
import { CalendarComponent } from './secure/enterprise/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PublicComponent,
    SecureComponent,
    TrendComponent,
    ChangepasswordComponent,
    CreateComponent,
    FeaturesComponent,
    SettingsComponent,
    SearchPipe,
    SortPipe,
    PoprofileComponent,
    EnterpriseHomeComponent,
    GoalsComponent,
    ObjectivesComponent,
    TeamsComponent,
    EnterpriseSettingsComponent,
    IndividualComponent,
    IndividualCreateComponent,
    TeamCreateComponent,
    EnterpriseInfoComponent,
    ReportsComponent,
    GoalsCreateComponent,
    ObjectivesCreateComponent,
    GoalsActivityComponent,
    ObjectivesActivityComponent,
    TeamInfoComponent,
    ActionsComponent,
    ActionsCreateComponent,
    ActionsNewComponent,
    ActionCategoriesComponent,
    CreateCategoriesComponent,
    ForgotPasswordComponent,
    FocusDirective,
    GuidingPrinciplesComponent,
    CompassComponent,
    ProgressTrackerComponent,
    PulseComponent,
    AddDateComponent,
    ShareComponent,
    PulseQestionComponent,
    UpdateQsnComponent,
    SplitPipe,
    ActionHelpComponent,
    LogComponent,
    DeleteModalComponent,
    FooterComponent,
    ProgressHelpComponent,
    CalendarComponent,
  ],
	entryComponents: [
    ChangepasswordComponent,
    CreateComponent,
    IndividualCreateComponent,
    TeamCreateComponent,
    GoalsCreateComponent,
    ObjectivesCreateComponent,
    GoalsActivityComponent,
    ObjectivesActivityComponent,
    ActionsCreateComponent,
    CreateCategoriesComponent,
    AddDateComponent,
    ShareComponent,
    UpdateQsnComponent,
    ActionHelpComponent,
    DeleteModalComponent,
    ProgressHelpComponent,
	],
  imports: [ 
    MbscModule,  
    BrowserModule,
    NgxPubSubModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
		TooltipModule.forRoot(),
		PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    DragDropModule,
    NgSelectModule,
    Ng5SliderModule,
    ChartsModule,
    MatTabsModule,
    NgxPaginationModule,
    EventBrokerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptors, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    GlobalService,
    EnterpriseService,
    DatePipe,
    GeolocationService,
    ShareService,
    AuthGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

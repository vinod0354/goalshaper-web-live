import { Component } from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription, Observable, timer } from 'rxjs';
import moment from 'moment';
import { AuthenticationService } from './services';
import { EventBrokerService } from 'ng-event-broker';
import { Help } from './events.model';


export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'goal-shaper-web';
  currentRoute: string = '';
  isTokenRefreshingInProgress:boolean = false;
  currentTokenExpiry: number;
  private subscription: Subscription;
  everySecond: Observable<number> = timer(0, 2000);
  constructor(private loadingBar: SlimLoadingBarService, private router: Router, private authenticationService: AuthenticationService, private eventService: EventBrokerService ) {
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
      browserRefresh = !this.router.navigated;
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
      let currentURL = event.url.slice(1);
      let URLArray = currentURL.split('/');
      this.currentRoute = URLArray.join('/');
      if(this.currentRoute != '' && this.currentRoute != null && this.currentRoute != 'login'){
        if(this.currentRoute.indexOf('login') == -1){
          //this.startWatchingJWTToken();
        }
      }else{
        //this.stopWatchingJWTToken();
      }

    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }

  // private MenuHelp() {
  //   this.eventService.registerEvent(Help.ActionHelp);
  //   this.eventService.registerEvent(Help.TrackerHelp);
  //   this.eventService.registerEvent(Help.CompassHelp);
  // }


  ngOnInit() {
    // this.MenuHelp();
  }

  startWatchingJWTToken(){

    console.log('Browser Refreshed:' + browserRefresh);
    if(browserRefresh == true){
      localStorage.removeItem('Watcher');
    }
    var watcher = localStorage.getItem('Watcher');
    if(watcher == undefined || watcher == null){
      var userInfo = localStorage.getItem('currentUser');
      var expiryDate;
      var userInfoObj;
      if(userInfo){
        userInfoObj = JSON.parse(userInfo);
        expiryDate = userInfoObj.expiry;
        this.currentTokenExpiry = expiryDate;
      }
      this.subscription = this.everySecond.subscribe((seconds) => {
        try{

          var watcher = localStorage.getItem('Watcher');
          if(watcher == undefined || watcher == null){
            this.stopWatchingJWTToken();
          }else{
            if(this.isTokenRefreshingInProgress == false){
              //console.log('Token Expiry:' + this.currentTokenExpiry);
              var localDate =  moment(new Date()).format(); //'YYYY-MM-DD HH:mm:ss.SSS'
              var currentTime = moment(localDate).unix();;
              //console.log('Current Time:' + currentTime);
              var timeDifference = this.currentTokenExpiry - currentTime;
              //console.log('Token Expires In '+timeDifference+' Seconds');
              /* need to check if expiry is less than 60 seconds then call refresh token and get the new token */
              if(timeDifference < 60){
                this.refreshToken();
              }
            }else{
              console.log('Token refreshing is in progress');
            }
          }
        }catch(e){
          /* nothing to do */
        }

      });
      localStorage.setItem('Watcher', 'STARTED');
    }else{
      console.log('Watcher already started');
    }
  }

  stopWatchingJWTToken(){
    var watcher = localStorage.getItem('Watcher');
    var currentMenu = localStorage.getItem('currentMenu');
    if(watcher == 'STARTED' || currentMenu == ''){
      console.log('Timer destroyed');
      try{
        this.subscription.unsubscribe();
      }catch(e){
        /* nothing to do */
      }
    }
  }

  refreshToken(){
    this.isTokenRefreshingInProgress = true;
    this.authenticationService.refreshToken().subscribe(
      (result) => {
        console.log(result);
        this.isTokenRefreshingInProgress = false
        if(result.status == 200){
          let refreshToken = result.body;
          localStorage.setItem('access_token', refreshToken.token);
          this.currentTokenExpiry = refreshToken.expiry;
          var currentUserInfoStr = localStorage.getItem('currentUser');
          if(currentUserInfoStr != null || currentUserInfoStr != undefined){
            var currentUserInfo = JSON.parse(currentUserInfoStr);
            currentUserInfo.token = refreshToken.token;
            currentUserInfo.expiry = refreshToken.expiry;
            this.authenticationService.currentUserSubject.next(currentUserInfo);
            localStorage.setItem('currentUser', JSON.stringify(currentUserInfo));
          }
        }else{
          /* Need to do something else */
          this.isTokenRefreshingInProgress = false;
        }
      },
      (error) => {
        this.isTokenRefreshingInProgress = false;
        console.log('Refresh Error Block');
        console.log(error);
      }
    );
  }


  ngOnDestroy(): void {
      this.stopWatchingJWTToken();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService, AuthenticationService } from '../../services';
import { User } from 'src/app/models/user';
import { GlobalService } from 'src/app/global/app.global.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  angForm: FormGroup;
  rememberMe: boolean;
  failedtoSignIn: boolean = false;
  btnSubmitStatus: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private global: GlobalService) {

    // redirect to home if already logged in
    try{
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
    }catch(err){

    }

  }

  ngOnInit() {
    this.createForm();
  }


  login(user_name, password) {
    //this.router.navigateByUrl('/home', { replaceUrl: true });
    if (user_name != '' && password != '') {
      this.btnSubmitStatus = false;
      this.failedtoSignIn = false;
      let userObj = {
        username: window.btoa(user_name),
        password: window.btoa(password)
      };
      console.log(userObj);
      this.authenticationService.login(userObj).subscribe(
        (result) => {
          console.log(result);
          if(result.status == 200){
            let currentUser = result.body;
            currentUser['authData'] = window.btoa(userObj.username)
            this.authenticationService.currentUserSubject.next(currentUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('access_token', currentUser.token);
            this.global.currentUserRoleId = currentUser.user.role_id;
            this.global.currentEnterpriseId = currentUser.user.enterprise_id;
            this.global.currentUserId = currentUser.user.user_id;
            this.btnSubmitStatus = true;
            localStorage.removeItem('EnterpriseFeatures');
            localStorage.removeItem('Enterprises');
            if(currentUser.user.role_id == 1){
              this.router.navigateByUrl('/home', { replaceUrl: true });
            }else{
              this.router.navigateByUrl('/ent/actions', {replaceUrl: true});
            }
          }else{
            /* Need to do something else */
            this.failedtoSignIn = true;
            this.btnSubmitStatus = true;
          }
        },
        (error) => {
          this.btnSubmitStatus = true;
          console.log('Error Block');
          console.log(error);
          this.failedtoSignIn = true;
        }
      );

    } else {
      this.failedtoSignIn = true;
    }
  }

  createForm() {
    this.angForm = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  forgotPassword(){
    this.router.navigateByUrl('/forgot-password',{replaceUrl:true})
  }

}

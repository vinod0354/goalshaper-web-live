import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, AuthenticationService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  rememberMe: boolean;
  failedtoSignIn: boolean = false;
  btnSubmitStatus: boolean = true;

  resetPwd={
    'username':''
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private global: GlobalService) { }

  ngOnInit() {
  }

  onReset():void{
    this.global.showLoading('Please wait...')
    this.authenticationService.forgotPassword(this.resetPwd.username)
    .subscribe(result=>{
      if(result.status == 200){
        console.log(result);
        this.global.hideLoading('Please wait...')
        this.sweetAlertDisplay("Password Sent to Email", true);
          this.router.navigate(['/login']);
        
      }
    },err=>{
      this.global.showErrorMessage('Please check your Email')
    });
  }


  sweetAlertDisplay(title, status) {

    if (status == true) {
      swal.fire({
        title: title,
        allowEscapeKey: false,
        showCloseButton: false,
        showConfirmButton:false,
        timer: 2000,
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
          
          // this.event.emit('true');
          // this.bsModalRef.hide();
        }
      });
    } else {

      swal.fire({
        title: title,
        html: '<span style="font-size:medium; color: #0072bb;">Something went wrong!! Try Again</span>',
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
      }).then((result) => {
        if (result.value) {
          //Do Nothing
        }
      });
    }
  }

}

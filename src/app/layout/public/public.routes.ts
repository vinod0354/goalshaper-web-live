import { LoginComponent } from './../../public/login';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/public/forgot-password/forgot-password.component';


export const PUBLIC_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password',component:ForgotPasswordComponent}
];
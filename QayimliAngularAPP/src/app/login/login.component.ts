import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrimengtoolsModule } from '../primengtools/primengtools.module';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LoginUser } from '../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimengtoolsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  constructor(
    public _AuthService: AuthService,
    private messageService: MessageService,
    private _Router: Router,
    private spinnerService: SpinnerService,
    private _TranslateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('usertoken') != null) {
        this._Router.navigate(['/home']);
      }
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('usertoken') != null) {
        this._Router.navigate(['/home']);
      }
    }
  }
  IsLoading: boolean = false;
  LoginError: string = '';
  Login(loginDetails: FormGroup) {
    if (this.loginForm.valid) {
      this.IsLoading = true;
      this.spinnerService.show();
      this._AuthService.login(loginDetails.value).subscribe({
        next: (response) => {
          var displayName: string = "";
          this._AuthService.userDetails$.subscribe((user: LoginUser) => displayName = user.displayName)
          this.IsLoading = false;
          this.spinnerService.hide();
          this.messageService.add({
            severity: 'success',
            summary: this._TranslateService.instant('MoToasterMessage.Success'),
            detail: this._TranslateService.instant('MoToasterMessage.UserLogin', { Name: displayName, WebsiteName: this._TranslateService.instant('MoCommon.WebsiteName') }),
          });
          loginDetails.reset();
          this._Router.navigate(['/home']);
        },
        error: (error) => {
          this.LoginError = error;
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: this._TranslateService.instant('MoToasterMessage.Error'),
            detail: this._TranslateService.instant('MoToasterMessage.UserLoginError'),
          });
          this.IsLoading = false;
          this.spinnerService.hide();
        },
      });
    }
  }
}

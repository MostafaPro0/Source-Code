import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { LoginUser, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  registerURL: string = `${environment.apiUrl}/Accounts/register`;
  loginURL: string = `${environment.apiUrl}/Accounts/login`;
  resetpasswordURL: string = `${environment.apiUrl}/Accounts/resetpassword`;
  getUserInfoURL: string = `${environment.apiUrl}/Accounts/getinfo`;

  isLogged = new BehaviorSubject<boolean | null>(null);
  private userSource = new BehaviorSubject<LoginUser>({} as LoginUser);
  userDetails$ = this.userSource.asObservable();
  userToken$ = new BehaviorSubject<string | null>(null);

  constructor(private _HttpClient: HttpClient, private _Router: Router,
    @Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const userToken = localStorage.getItem('usertoken');
      if (userToken) {
        this.userToken$.next(userToken);
      }
      else {
        this.isLogged.next(false);
      }
      this.userToken$.subscribe({
        next: () => {
          if (this.userToken$.getValue() !== null) {
            this.isLogged.next(true);
          }
          else {
            this.isLogged.next(false);
          }
        }
      });
    }
  }
  decode() {
    let encodeusertok = JSON.stringify(localStorage.getItem('usertoken'));
    let decodeusertok: any = jwtDecode(encodeusertok);
    this.userSource.next(decodeusertok);
    console.log(decodeusertok);
    const userToken = localStorage.getItem('usertoken');
    if (userToken) {
      this.isLogged.next(true);
      this.userToken$.next(userToken);
    }
    else {
      this.isLogged.next(false);
    }
  }

  getUserInfo(): Observable<any> {
    return this._HttpClient.get(this.getUserInfoURL)
  }
  register(userdata: object): Observable<any> {
    return this._HttpClient.post(this.registerURL, userdata).pipe(
      map((user: any) => {
        console.log(user);
        if (user) {
          localStorage.setItem('usertoken', user.token);
          this.decode();
          this.updateUserDetails(user);
        }
      })
    );
  }
  login(userdata: object): Observable<any> {
    return this._HttpClient.post(this.loginURL, userdata).pipe(
      map((user: any) => {
        console.log(user);
        if (user) {
          localStorage.setItem('usertoken', user.token);
          this.decode();
          this.updateUserDetails(user);
        }
      })
    );
  }
  loadCurrentUser(token: string): Observable<any> {
    if (token == null || token == '') {
      this.userSource.next({} as LoginUser);
      return of(null);
    }
    return this.getUserInfo().pipe(
      map((user: LoginUser) => {
        if (user) {
          localStorage.setItem('usertoken', user.token);
          this.updateUserDetails(user);
        }
      })
    )
  }
  updateUserDetails(userDetails: LoginUser): void {
    console.log(userDetails);

    this.userSource.next(userDetails);
  }
  resetPassword(userdata: object): Observable<any> {
    return this._HttpClient.put(this.resetpasswordURL, userdata)
  }
  logout() {
    localStorage.removeItem('usertoken');
    this.isLogged.next(false);
    this.userToken$.next(null);
    this.userSource.next({} as LoginUser);
    this._Router.navigate(['/login']);
    console.log(this.isLogged.getValue());
    console.log(this.userToken$.getValue());
    console.log(this.userSource.getValue());

  }
}

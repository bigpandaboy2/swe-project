import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  httpClient = inject(HttpClient)
  baseUrl = 'http://localhost:5000'

  signupFarmer(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/register/farmer`, data)
  }

  signupBuyer(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/register/buyer`, data)
  }

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/login`, data).pipe(tap((result: any) => {
      localStorage.setItem('accessToken', result['accessToken']); localStorage.setItem('role', result['role'])
    }))
  }

  loginAdmin(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/admin/login`, data).pipe(tap((result: any) => {
      localStorage.setItem('accessToken', result['accessToken'])
    }))
  }

  isLoggedIn() {
    return localStorage.getItem('accessToken') !== null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
}

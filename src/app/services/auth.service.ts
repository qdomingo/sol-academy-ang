import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { environment } from '../../environments/environment';
   import { User } from '../models/user.model';

   @Injectable({
     providedIn: 'root'
   })
   export class AuthService {

     baseUrl = environment.baseUrl;
     private resourceAuthUrl = this.baseUrl + 'api/auth';
     private authToken: string | null = null;

     constructor(private http: HttpClient) { 
      this.authToken = localStorage.getItem('authToken');
     }

     register(user: any): Observable<any> {
       return this.http.post(`${this.resourceAuthUrl}/register`, user, { responseType: 'text' });
     }

     login(user: User): Observable<any> {
      this.authToken = 'Basic ' + btoa(`${user.username}:${user.password}`);
      localStorage.setItem('authToken', this.authToken);
      return this.http.post(`${this.resourceAuthUrl}/login`, user, { responseType: 'text' });
     }

     getAuthToken(): string | null {
      return this.authToken;
    }
    
    logout(): void {
      this.authToken = null;
      localStorage.removeItem('authToken');
    }

   }

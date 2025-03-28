// import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    ): Observable<HttpEvent<any>> => {
        console.log(req.url);
        const authService = inject(AuthService);
        const router = inject(Router);
        const authToken = authService.getAuthToken();
        if (authToken) {
            req = req.clone({
                setHeaders: { 
                    Authorization: `${authToken}`
                },
            });
        }
        // return next(req); 
        return next(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Redirigir al usuario a la página de login
                    router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    };
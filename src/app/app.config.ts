import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { AuthInterceptor } from './interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })
  ]
};

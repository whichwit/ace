import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { effects } from '@app/state/effects';

import { RootComponent } from '@app/containers'
import {
  NotFoundComponent,
} from '@app/components';
import { reducers, metaReducers } from '@app/state/reducers';
import { provideRouterStore } from '@ngrx/router-store';
import { AppointmentComponent } from '@app/components/appointment/appointment.component';
import { provideHttpClient } from '@angular/common/http';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {provideStoreDevtools } from '@ngrx/store-devtools'

const routes: Route[] = [
  { path: 'not-found', component: NotFoundComponent },
  {
    path: 'appointment',
    component: AppointmentComponent
  },
  {path: '', pathMatch: 'full', redirectTo: 'appointment'},
  { path: '**', redirectTo: 'not-found' }
]

bootstrapApplication(RootComponent, {
  providers: [
    provideRouter(routes),
    provideStore(reducers, { metaReducers }),
    provideEffects(effects),
    provideHttpClient(),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      // logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: false, // Pauses recording actions and state changes when the extension window is not open
      trace: true, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatNativeDateModule,
      MatSnackBarModule,
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ]
});

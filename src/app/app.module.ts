import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppsModule } from './apps/apps.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DeninedComponent } from './denined/denined.component';
import { LoginModule } from './login/login.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { environment } from '../environments/environment';
import { HttpModule } from '@angular/http';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DeninedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ClarityModule.forRoot(),
    LoginModule,
    AppsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'LOGIN_URL', useValue: environment.loginUrl },
    { provide: 'DOC_URL', useValue: environment.docUrl },
    { provide: 'HOME_URL', useValue: environment.homeUrl },
    { provide: 'PM_PRIFIX', useValue: environment.pmPrefix },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

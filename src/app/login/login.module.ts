import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule { }

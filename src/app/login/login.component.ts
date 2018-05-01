import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging: boolean = false;

  token: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      const accessRight = decodedToken.accessRight;

      try {
        const rights = accessRight.split(',');

        if (_.indexOf(rights, 'BM_ADMIN') > -1) {
          this.router.navigate(['apps']);
        } else {
          this.alertService.error('ไม่มีสิทธิ์ในการเข้าถึง กรุณาลองไหม่');
          this.router.navigate(['/login']);
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    }
  }

  enterLogin(event: any) {
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  async doLogin() {
    if (this.username && this.password) {
      this.isLogging = true;
      try {
        let rs: any = await this.loginService.doLogin(this.username, this.password);
        this.isLogging = false;
        if (rs.ok) {
          const token: any = rs.token || null;
          const decodedToken = this.jwtHelper.decodeToken(token);
          sessionStorage.setItem('token', rs.token);

          const accessRight = decodedToken.accessRight;
          const rights = accessRight.split(',');

          if (_.indexOf(rights, 'BM_ADMIN') > -1) {
            this.router.navigate(['/apps']);
          } else {
            this.alertService.error('ไม่มีสิทธิ์ในการเข้าถึง กรุณาลองไหม่');
          }
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.isLogging = false;
        this.alertService.error(JSON.stringify(error));
      }
    }
  }
}

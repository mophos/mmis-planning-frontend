import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;
  isLogging: boolean = false;
  
  constructor(private router: Router, private loginService: LoginService, private alertService: AlertService) { }

  ngOnInit() {
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
          let token: any = rs.token || null;
          sessionStorage.setItem('token', rs.token);
          this.router.navigate(['/apps']);
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

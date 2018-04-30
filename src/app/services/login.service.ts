import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(@Inject('LOGIN_URL') private url: string, private http: Http) { }

  async doLogin(username: any, password: any) {
    let rs: any = await this.http.post(`${this.url}/login`, {
      username: username,
      password: password
    }).toPromise();

    return rs.json();
  }
}

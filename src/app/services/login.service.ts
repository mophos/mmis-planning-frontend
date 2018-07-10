import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(
    @Inject('LOGIN_URL') private url: string, private http: Http) { }

  async doLogin(username: any, password: any, warehouseId) {
    let rs: any = await this.http.post(`${this.url}/login`, {
      username: username,
      password: password,
      warehouseId: warehouseId
    }).toPromise();
    return rs.json();
  }

  async searchWarehouse(username: string) {
    let rs: any = await this.http.get(`${this.url}/login/warehouse/search?username=${username}`).toPromise();
    return rs.json();
  }
}

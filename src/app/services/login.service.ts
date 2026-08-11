import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(
    @Inject('LOGIN_URL') private url: string, private http: Http) { }

  async doLogin(username: any, password: any, userWarehouseId) {
    let rs: any = await this.http.post(`${this.url}/login`, {
      username: username,
      password: password,
      userWarehouseId: userWarehouseId,
        supportLoginSteps: true
    }, { withCredentials: true }).toPromise();
    return rs.json();
  }

  async searchWarehouse(username: string) {
    let rs: any = await this.http.get(`${this.url}/login/warehouse/search?username=${username}`).toPromise();
    return rs.json();
  }

  /**
   * ขั้นตอนหลังตรวจรหัสผ่านทุกตัวใช้ preAuthToken แทน token จริง
   * preAuthToken มีอายุ 15 นาที และใช้เรียก API อื่นของระบบไม่ได้
   */
  private postWithPreAuth(path: string, preAuthToken: string, body: any = {}) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${preAuthToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}${path}`, body, { headers: headers, withCredentials: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  changePassword(preAuthToken: string, password: string, confirmPassword: string) {
    return this.postWithPreAuth('/login/change-password', preAuthToken, {
      password: password,
      confirmPassword: confirmPassword
    });
  }

  setup2fa(preAuthToken: string) {
    return this.postWithPreAuth('/login/2fa/setup', preAuthToken);
  }

  confirm2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/confirm', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
  }

  verify2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/verify', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
  }
}

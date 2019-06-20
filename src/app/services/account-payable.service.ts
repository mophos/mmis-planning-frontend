import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountPayableService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getList() {
    const rs: any = await this.authHttp.get(`${this.url}/account-payable`).toPromise();
    return rs.json();
  }

  async getInfo(payableId) {
    const rs: any = await this.authHttp.get(`${this.url}/account-payable/info/${payableId}`).toPromise();
    return rs.json();
  }

  async getHead(payableId) {
    const rs: any = await this.authHttp.get(`${this.url}/account-payable/head/${payableId}`).toPromise();
    return rs.json();
  }

  async getReceive(query) {
    const rs: any = await this.authHttp.get(`${this.url}/account-payable/receive?query=${query}`).toPromise();
    return rs.json();
  }

  async getDetail(payableId) {
    const rs: any = await this.authHttp.get(`${this.url}/account-payable/detail?payableId=${payableId}`).toPromise();
    return rs.json();
  }

  async save(date, detail) {
    const rs: any = await this.authHttp.post(`${this.url}/account-payable`, {
      date: date,
      detail: detail
    }).toPromise();
    return rs.json();
  }

  async update(payableId, detail) {
    const rs: any = await this.authHttp.put(`${this.url}/account-payable`, {
      payableId: payableId,
      detail: detail
    }).toPromise();
    return rs.json();
  }


}

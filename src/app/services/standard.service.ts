import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StandardService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getTypes() {
    let rs: any = await this.authHttp.get(`${this.url}/standard/types`)
      .toPromise();
    return rs.json();
  }

  async getBgTypes() {
    let rs: any = await this.authHttp.get(`${this.url}/standard/bgtypes`)
      .toPromise();
    return rs.json();
  }

  async getBidTypes() {
    let rs: any = await this.authHttp.get(`${this.url}/standard/bidtypes`)
      .toPromise();
    return rs.json();
  }

  async getStatus() {
    let rs: any = await this.authHttp.get(`${this.url}/standard/status`)
      .toPromise();
    return rs.json();
  }

  async getUnitConversion(genericId: any) {
    const response = await this.authHttp.get(`${this.url}/standard/units/${genericId}`)
      .toPromise();
    return response.json();

  }

  async getGenericTypes() {
    const rs = await this.authHttp.get(`${this.url}/standard/generic-types`)
      .toPromise();
    return rs.json();

  }

}

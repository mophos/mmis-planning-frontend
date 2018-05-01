import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BidTypeService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getBidType() {
    const rs: any = await this.authHttp.get(`${this.url}/bid-type`).toPromise();
    return rs.json();
  }

  async insertBidType(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/bid-type`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async updateBidType(bidTypeId: any, data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/bid-type/${bidTypeId}`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async deleteBidType(bidTypeId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/bid-type/${bidTypeId}`).toPromise();
    return rs.json();
  }

  async updateDefault(bidTypeId: any) {
    const rs: any = await this.authHttp.put(`${this.url}/bid-type/${bidTypeId}/default`, null).toPromise();
    return rs.json();
  }

}

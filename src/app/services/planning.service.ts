import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlanningService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getPlanningHeader(year: any, status: any, name: any) {
    const rs: any = await this.authHttp.get(`${this.url}/planning?year=${year}&status=${status}&name=${name}`).toPromise();
    return rs.json();
  }

  async getPlanningHeaderInfo(headerId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/planning/info/${headerId}`).toPromise();
    return rs.json();
  }

  async getPlanningDetail(headerId: any, _uuid: any) {
    const rs: any = await this.authHttp.get(`${this.url}/planning/detail/${headerId}?uuid=${_uuid}`).toPromise();
    return rs.json();
  }

  async getPlanningHistory(headerId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/planning/history/${headerId}`).toPromise();
    return rs.json();
  }

  async insertPlanning(header: any, _uuid: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning`, {
      header: header,
      uuid: _uuid
    }).toPromise();
    return rs.json();
  }

  async updatePlanning(header: any, _uuid: any) {
    const rs: any = await this.authHttp.put(`${this.url}/planning`, {
      header: header,
      uuid: _uuid
    }).toPromise();
    return rs.json();
  }

  async getPlanningYear() {
    const rs: any = await this.authHttp.get(`${this.url}/planning/year`)
      .toPromise();
    return rs.json();
  }

  async getForecast(genericId: any, forecastYear: any, tmpId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/planning/forecast/${genericId}/${forecastYear}?tmpId=${tmpId}`)
      .toPromise();
    return rs.json();
  }

  async processForecast(planningYear: any, _uuid: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/process`, {
      year: planningYear,
      uuid: _uuid
    })
      .toPromise();
    return rs.json();
  }

  async getPlanningTmp(_uuid: any, query: any, genericType: any, limit: number, offset: number) {
    const rs: any = await
      this.authHttp.get(`${this.url}/planning/tmp?uuid=${_uuid}&query=${query}&genericType=${genericType}&limit=${limit}&offset=${offset}`)
      .toPromise();
    return rs.json();
  }

  async insertPlanningTmp(_uuid: any, data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/tmp`, {
      uuid: _uuid,
      data: data
    }).toPromise();
    return rs.json();
  }

  async updatePlanningTmp(_uuid: any, data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/planning/tmp`, {
      uuid: _uuid,
      data: data
    }).toPromise();
    return rs.json();
  }

  async deletePlanningTmp(tmpId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/planning/tmp/${tmpId}`).toPromise();
    return rs.json();
  }

  async processAdjustAmount(_uuid: any, amount: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/adjust-amount`, {
      uuid: _uuid,
      amount: amount
    })
      .toPromise();
    return rs.json();
  }

  async processAdjustPercent(_uuid: any, percent: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/adjust-percent`, {
      uuid: _uuid,
      percent: percent
    })
      .toPromise();
    return rs.json();
  }

  async processCopyPercent(headerId: any, percent: any, planningYear: any, _uuid: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/copy`, {
      headerId: headerId,
      percent: percent,
      year: planningYear,
      uuid: _uuid
    })
      .toPromise();
    return rs.json();
  }

  async processMergePercent(headerIds: any[], _uuid: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/merge`, {
      headerIds: headerIds,
      uuid: _uuid
    })
      .toPromise();
    return rs.json();
  }

  async clearPlanningTmp(_uuid: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/clear-tmp`, {
      uuid: _uuid
    }).toPromise();
    return rs.json();
  }

  async callForecast(planningYear: any) {
    const rs: any = await this.authHttp.post(`${this.url}/planning/forecast`, {
      year: planningYear
    }).toPromise();
    return rs.json();
  }

}

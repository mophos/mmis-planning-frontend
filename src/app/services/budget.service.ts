import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BudgetService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getBudgetDetail(budgetYear: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/detail/${budgetYear}`).toPromise();
    return rs.json();
  }

  async insertBudgetDetail(budgetDetail: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget/detail`, {
      budgetDetail: budgetDetail
    }).toPromise();
    return rs.json();
  }

  async updateBudgetDetail(budgetDetailId: any, budgetDetail: any) {
    const rs: any = await this.authHttp.put(`${this.url}/budget/detail/${budgetDetailId}`, {
      budgetDetail: budgetDetail
    }).toPromise();
    return rs.json();
  }

  async approveBudgetDetail(budgetDetailIds: any[]) {
    const res = await this.authHttp.post(`${this.url}/budget/approve`, {
      budgetDetailIds: budgetDetailIds
    }).toPromise();
    return res.json();
  }

  async getBudgetYear() {
    const rs: any = await this.authHttp.get(`${this.url}/budget/year`).toPromise();
    return rs.json();
  }

  async getTotalBudget(budgetYear: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/total/${budgetYear}`).toPromise();
    return rs.json();
  }

  async getTotalSubBudget(budgetYear: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/sub-total/${budgetYear}`).toPromise();
    return rs.json();
  }

  async getBudgetTransaction(budgetYear: any, budgetDetailId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/transaction/${budgetYear}/${budgetDetailId}`).toPromise();
    return rs.json();
  }

  async getBudgetByYear(budgetYear: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/list/${budgetYear}`).toPromise();
    return rs.json();
  }

  async getBudgetSource() {
    const rs: any = await this.authHttp.get(`${this.url}/budget-source`).toPromise();
    return rs.json();
  }

  async insertBudgetSource(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget-source`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async updateBudgetSource(budgetSourceId: any, data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/budget-source/${budgetSourceId}`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async deleteBudgetSource(budgetSourceId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/budget-source/${budgetSourceId}`).toPromise();
    return rs.json();
  }

  async getBudgetType() {
    const rs: any = await this.authHttp.get(`${this.url}/budget-type`).toPromise();
    return rs.json();
  }

  async insertBudgetType(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget-type`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async updateBudgetType(typeId: any, data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/budget-type/${typeId}`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async deleteBudgetType(typeId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/budget-type/${typeId}`).toPromise();
    return rs.json();
  }

  async getBudgetSubType() {
    const rs: any = await this.authHttp.get(`${this.url}/budget-subtype`).toPromise();
    return rs.json();
  }

  async insertBudgetSubType(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget-subtype`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async updateBudgetSubType(subTypeId: any, data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/budget-subtype/${subTypeId}`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async deleteBudgetSubType(subTypeId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/budget-subtype/${subTypeId}`).toPromise();
    return rs.json();
  }

  async insertBudgetTransaction(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget/sub-total`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async getWarehouse() {
    const rs: any = await this.authHttp.get(`${this.url}/budget/get-warehouse`).toPromise();
    return rs.json();
  }

  async getBudgetWarehouse(bgdetail_id: any) {
    const rs: any = await this.authHttp.get(`${this.url}/budget/get-budget-warehouse/${bgdetail_id}`).toPromise();
    return rs.json();
  }

  async saveSubBudgetWarehouse(data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/budget/save-subbudget-warehouse`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async deleteSubBudgetWarehouse(subBudget: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/budget/delete-subbudget-warehouse?subBudget=${subBudget}`).toPromise();
    return rs.json();
  }

}

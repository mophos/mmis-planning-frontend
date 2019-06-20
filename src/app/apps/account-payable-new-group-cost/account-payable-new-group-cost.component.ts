import { AlertService } from './../../services/alert.service';
import { AccountPayableService } from './../../services/account-payable.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { IMyOptions } from 'mydatepicker-th';
import { Router } from '@angular/router';
@Component({
  selector: 'pm-account-payable-new-group-cost',
  templateUrl: './account-payable-new-group-cost.component.html',
  styles: []
})
export class AccountPayableNewGroupCostComponent implements OnInit {

  list = [];
  listSave = [];
  query = '';
  date: any;
  isSave = false;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  @ViewChild('pmLoading') private pmLoading;

  no1Greater = null;
  no1Less = null;
  no2Greater = null;
  no2Less = null;
  no3Greater = null;
  no3Less = null;
  no4Greater = null;
  no4Less = null;
  constructor(
    private accountPayableService: AccountPayableService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getList();


    const date = new Date();
    this.date = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.no1Greater = localStorage.getItem('no1Greater') ? localStorage.getItem('no1Greater') : null;
    this.no1Less = localStorage.getItem('no1Less') ? localStorage.getItem('no1Less') : null;
    this.no2Greater = localStorage.getItem('no2Greater') ? localStorage.getItem('no2Greater') : null;
    this.no2Less = localStorage.getItem('no2Less') ? localStorage.getItem('no2Less') : null;
    this.no3Greater = localStorage.getItem('no3Greater') ? localStorage.getItem('no3Greater') : null;
    this.no3Less = localStorage.getItem('no3Less') ? localStorage.getItem('no3Less') : null;
    this.no4Greater = localStorage.getItem('no4Greater') ? localStorage.getItem('no4Greater') : null;
    this.no4Less = localStorage.getItem('no4Less') ? localStorage.getItem('no4Less') : null;
  }


  async getList() {
    try {
      this.pmLoading.show();
      const rs: any = await this.accountPayableService.getReceive(this.query);
      if (rs.ok) {
        this.list = _.differenceWith(rs.rows, this.listSave, _.isEqual);
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.error(error);
    }
  }

  enterSearch(e) {
    if (e.keyCode === 13) {
      this.getList();
    }
  }

  addItem(i) {
    const idx = _.findIndex(this.list, { 'receive_id': i.receive_id });
    if (idx > -1) {
      this.list.splice(idx, 1);
    }
    this.listSave.push(i);
  }

  removeItem(i) {
    const idx = _.findIndex(this.listSave, { 'receive_id': i.receive_id });
    if (idx > -1) {
      this.listSave.splice(idx, 1);
    }
    this.list.push(i);
  }


  async save() {
    try {
      this.isSave = true;
      const _date = this.date ? `${this.date.date.year}-${this.date.date.month}-${this.date.date.day}` : null;
      let s1 = [];
      let s2 = [];
      let s3 = [];
      let s4 = [];
      const that = this;
      if (this.no1Greater != null && this.no1Less != null) {
        s1 = _.filter(this.listSave, function (o: any) { return o.total_price > that.no1Greater && o.total_price < that.no1Less; });
        localStorage.setItem('no1Greater', this.no1Greater);
        localStorage.setItem('no1Less', this.no1Less);
      }
      if (this.no2Greater != null && this.no2Less != null) {
        s2 = _.filter(this.listSave, function (o: any) { return o.total_price > that.no2Greater && o.total_price < that.no2Less; });
        localStorage.setItem('no2Greater', this.no2Greater);
        localStorage.setItem('no2Less', this.no2Less);
      }
      if (this.no3Greater != null && this.no3Less != null) {
        s3 = _.filter(this.listSave, function (o: any) { return o.total_price > that.no3Greater && o.total_price < that.no3Less; });
        localStorage.setItem('no3Greater', this.no3Greater);
        localStorage.setItem('no3Less', this.no3Less);
      }
      if (this.no4Greater != null && this.no4Less != null) {
        s4 = _.filter(this.listSave, function (o: any) { return o.total_price > that.no4Greater && o.total_price < that.no4Less; });
        localStorage.setItem('no4Greater', this.no4Greater);
        localStorage.setItem('no4Less', this.no4Less);
      }

      if (s1.length > 0) {
        await this.accountPayableService.save(_date, s1);
      }
      if (s2.length > 0) {
        await this.accountPayableService.save(_date, s2);
      }
      if (s3.length > 0) {
        await this.accountPayableService.save(_date, s3);
      }
      if (s4.length > 0) {
        await this.accountPayableService.save(_date, s4);
      }

      this.alertService.success();
      this.router.navigate(['/apps/account-payable']);
    } catch (error) {
      this.isSave = false;
      this.alertService.error(error);

    }
  }
}

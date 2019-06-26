import { AlertService } from './../../services/alert.service';
import { AccountPayableService } from './../../services/account-payable.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { IMyOptions } from 'mydatepicker-th';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'pm-account-payable-new',
  templateUrl: './account-payable-new.component.html',
  styles: []
})
export class AccountPayableNewComponent implements OnInit {

  list = [];
  listSave = [];
  query = '';
  date: any;
  isSave = false;
  perpage = 10;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };
  payableId: any;
  payableCode: any;
  @ViewChild('pmLoading') private pmLoading;
  constructor(
    private accountPayableService: AccountPayableService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.payableId = params.payableId;
      });
  }

  async ngOnInit() {
    if (this.payableId) {
      await this.getHead();
      await this.getInfo();
    } else {
      await this.getList();
    }


    const date = new Date();
    this.date = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
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

  async getHead() {
    try {
      this.pmLoading.show();
      const rs: any = await this.accountPayableService.getHead(this.payableId);
      if (rs.ok) {
        this.payableCode = rs.rows[0].payable_code;
        const date = rs.rows[0].payable_date;
        this.date = {
          date: {
            year: moment(date).get('year') + 543,
            month: moment(date).get('month'),
            day: moment(date).get('day')
          }
        };
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.error(error);
    }
  }

  async getInfo() {
    try {
      this.pmLoading.show();
      const rs: any = await this.accountPayableService.getInfo(this.payableId);
      if (rs.ok) {
        this.listSave = rs.rows;
        await this.getList();
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
      let rs: any;
      if (this.payableId) {
        rs = await this.accountPayableService.update(this.payableId, this.listSave);
      } else {
        rs = await this.accountPayableService.save(_date, this.listSave);
      }
      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/apps/account-payable']);
      } else {
        this.isSave = false;
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.isSave = false;
      this.alertService.error(error);

    }
  }
}

import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LoadingComponent } from '../../modals/loading/loading.component';
import { BudgetService } from '../../services/budget.service';
import { AlertService } from '../../services/alert.service';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'pm-budget',
  templateUrl: './budget.component.html',
  styles: []
})
export class BudgetComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;
  @ViewChild('htmlPreview') private htmlPreview: any;

  selectedApprove = [];
  budgetDetails = [];
  totalBudgets = [];
  totalSubBudgets = [];
  budgetTransactions = [];
  years = [];
  budgetTypes = [];
  budgetSubTypes = [];
  budgetSources = [];
  budgetYears = [];
  budgetList = [];

  disableBudgetYear = false;
  openBudgetModal = false;

  selectedYear: any = moment().get('year') + (moment().get('month') > 8 ? 1 : 0);
  bugdetDetailId: any;
  budgetYear: any;
  budgetTypeId: any;
  operationDate: any;
  budgetSourceId: any;
  budgetAmount: any;
  budgetSubTypeId: any;
  budgetStatus: any;
  selectedBudgetDetailId: any = '';
  token: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    @Inject('API_URL') private url: string,
    private budgetService: BudgetService,
    private alertService: AlertService,
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.getBudgetDetail();
    this.getBudgetYear();
    this.getBudgetType();
    this.getBudgetSubType();
    this.getBudgetSource();
    this.getBudgetByYear();
    const _min = new Date().getFullYear();
    this.years = Array.from(new Array(5), (x, i) => _min + i);
  }

  async getBudgetYear() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetYear();
      if (rs.ok) {
        this.budgetYears = rs.rows || this.selectedYear;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getBudgetDetail() {
    if (this.selectedYear) {
      try {
        this.pmLoading.show();
        const rs: any = await this.budgetService.getBudgetDetail(this.selectedYear);
        if (rs.ok) {
          this.budgetDetails = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
        this.pmLoading.hide();
      } catch (error) {
        this.pmLoading.hide();
        this.alertService.serverError();
      }
    } else {
      this.budgetDetails = [];
    }
  }

  async getTotalBudget() {
    if (this.selectedYear) {
      try {
        this.pmLoading.show();
        const rs: any = await this.budgetService.getTotalBudget(this.selectedYear);
        if (rs.ok) {
          this.totalBudgets = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
        this.pmLoading.hide();
      } catch (error) {
        this.pmLoading.hide();
        this.alertService.serverError();
      }
    } else {
      this.totalBudgets = [];
    }
  }

  async getTotalSubBudget() {
    if (this.selectedYear) {
      try {
        this.pmLoading.show();
        const rs: any = await this.budgetService.getTotalSubBudget(this.selectedYear);
        if (rs.ok) {
          this.totalSubBudgets = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
        this.pmLoading.hide();
      } catch (error) {
        this.pmLoading.hide();
        this.alertService.serverError();
      }
    } else {
      this.totalSubBudgets = [];
    }
  }

  async getBudgetTransaction() {
    if (this.selectedYear) {
      try {
        this.pmLoading.show();
        const rs: any = await this.budgetService.getBudgetTransaction(this.selectedYear, this.selectedBudgetDetailId);
        if (rs.ok) {
          this.budgetTransactions = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
        this.pmLoading.hide();
      } catch (error) {
        this.pmLoading.hide();
        this.alertService.serverError();
      }
    } else {
      this.budgetTransactions = [];
    }
  }

  addBudget() {
    this.disableBudgetYear = false;
    this._initialBudgetDetail();
    this.openBudgetModal = true;
  }

  private _initialBudgetDetail() {
    this.bugdetDetailId = null;
    this.budgetTypeId = null;
    this.operationDate = null;
    this.budgetSourceId = null;
    this.budgetAmount = null;
    this.budgetSubTypeId = null;
  }

  async getBudgetType() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetType();
      if (rs.ok) {
        this.budgetTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getBudgetSubType() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetSubType();
      if (rs.ok) {
        this.budgetSubTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getBudgetSource() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetSource();
      if (rs.ok) {
        this.budgetSources = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getBudgetByYear() {
    if (this.selectedYear) {
      try {
        this.pmLoading.show();
        const rs: any = await this.budgetService.getBudgetByYear(this.selectedYear);
        if (rs.ok) {
          this.budgetList = rs.rows;
        } else {
          this.alertService.error(JSON.stringify(rs.error));
        }
        this.pmLoading.hide();
      } catch (error) {
        this.pmLoading.hide();
        this.alertService.serverError();
      }
    } else {
      this.budgetList = [];
    }
  }

  saveBudgetDetail() {
    if (this.budgetYear && this.budgetTypeId && this.budgetSubTypeId && this.operationDate && this.budgetSourceId
      && this.budgetAmount) {
      this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
        .then(async () => {
          let detail: any = {};
          detail.budgetYear = this.budgetYear;
          detail.budgetTypeId = this.budgetTypeId;
          detail.budgetSubTypeId = this.budgetSubTypeId;
          detail.operationDate =
            this.operationDate ? `${this.operationDate.date.year}-${this.operationDate.date.month}-${this.operationDate.date.day}` : null;
          detail.budgetSourceId = this.budgetSourceId;
          detail.budgetAmount = this.budgetAmount;
          try {
            this.pmLoading.show();
            let rs: any;
            if (this.bugdetDetailId) {
              rs = await this.budgetService.updateBudgetDetail(this.bugdetDetailId, detail);
            } else {
              rs = await this.budgetService.insertBudgetDetail(detail);
            }
            if (rs.ok) {
              this.alertService.success();
              this.openBudgetModal = false;
              this.getBudgetDetail();
            } else {
              this.alertService.error(rs.error);
            }
            this.pmLoading.hide();
          } catch (error) {
            this.pmLoading.hide();
            this.alertService.serverError();
          }
        }).catch(() => { });
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  editBudgetDetail(b) {
    this.disableBudgetYear = true;
    this.bugdetDetailId = b.bgdetail_id;
    this.budgetYear = b.bg_year;
    this.budgetTypeId = b.bgtype_id;
    this.budgetSourceId = b.bgsource_id;
    this.budgetAmount = b.amount;
    this.budgetSubTypeId = b.bgtypesub_id;
    this.budgetStatus = b.status;
    if (b.od_date) {
      this.operationDate = {
        date: {
          year: moment(b.od_date).get('year'),
          month: moment(b.od_date).get('month') + 1,
          day: moment(b.od_date).get('date'),
        },
        jsdate: b.od_date
      };
    }
    this.openBudgetModal = true;
  }

  approveBudgetDetail() {
    const budgetDetailIds = [];
    _.forEach(this.selectedApprove, (b) => {
      if (b.status === 'OPEN') {
        budgetDetailIds.push(b.bgdetail_id);
      }
    });
    if (budgetDetailIds.length) {
      this.alertService.confirm('คุณต้องการอนุมัติจำนวน ' + budgetDetailIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          this.pmLoading.show();
          this.budgetService.approveBudgetDetail(budgetDetailIds)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.selectedApprove = [];
                this.getBudgetDetail();
              } else {
                this.alertService.error(rs.error);
              }
              this.pmLoading.hide();
            })
            .catch((error: any) => {
              this.pmLoading.hide();
              this.alertService.serverError();
            });
        }).catch(() => { });
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  searchBudgetDetail() {
    this.selectedBudgetDetailId = '';
    this.getBudgetByYear();
    this.getBudgetDetail();
    this.getTotalBudget();
    this.getTotalSubBudget();
    this.getBudgetTransaction();
  }

  async printReportBudget() {
    const url = `${this.url}/budget/report/sub-total?budgetYear=` + this.budgetYears[0].bg_year + `&token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

}

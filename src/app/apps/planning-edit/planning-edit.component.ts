import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { SelectUnitComponent } from '../../directives/select-unit/select-unit.component';
import { SearchGenericComponent } from '../../directives/search-generic/search-generic.component';
import { SelectBidtypeComponent } from '../../directives/select-bidtype/select-bidtype.component';
import { BidType } from '../../interfaces/bid-type';
import { AlertService } from '../../services/alert.service';
import { PlanningService } from '../../services/planning.service';
import { LoadingComponent } from '../../modals/loading/loading.component';
import { DatagridPlanningComponent } from '../../directives/datagrid-planning/datagrid-planning.component';
import { AdjustPlanningComponent } from '../../modals/adjust-planning/adjust-planning.component';
import { UploadExcelComponent } from '../../modals/upload-excel/upload-excel.component';
import { UploadingService } from '../../services/uploading.service';
import { BudgetService } from '../../services/budget.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'pm-planning-edit',
  templateUrl: './planning-edit.component.html',
  styles: []
})
export class PlanningEditComponent implements OnInit {
  @ViewChild('selectUnit') selectUnit: SelectUnitComponent;
  @ViewChild('selectBidType') selectBidType: SelectBidtypeComponent;
  @ViewChild('searchGeneric') searchGeneric: SearchGenericComponent;
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;
  @ViewChild('adjustModal') private adjustModal: AdjustPlanningComponent;
  @ViewChild('dataGrid') private dataGrid: DatagridPlanningComponent;
  @ViewChild('htmlPreview') private htmlPreview: any;
  @ViewChild('uploadModal') private uploadModal: UploadExcelComponent;

  _token: any;
  _uuid: any;

  planningHeaderId: any;
  years = [];
  plannings = [];
  history = [];
  budgetTypes = [];

  planningStatus: any = 'N';
  totalAmount = 0;
  planningName: any;
  planningMemo: any;
  planningYear: any;
  refHeaderId: any;
  query: any;
  genericType: any;
  budgetTypeId: any;

  perPage = 5;
  offset = 0;
  planningTotal = 0;

  constructor(
    @Inject('API_URL') private url: string,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private planningService: PlanningService,
    private uploadingService: UploadingService,
    private budgetService: BudgetService,
  ) {
    this.planningHeaderId = this.route.snapshot.params.headerId;
    this._uuid = uuid();
    console.log('_uuid', this._uuid);
    this._token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    const _min = new Date().getFullYear();
    this.years = Array.from(new Array(5), (x, i) => _min + i);
    this.getPlanningHeaderInfo();
    this.getPlanningDetail();
    this.getPlanningHistory();
    this.getBudgetType();
  }

  async getBudgetType() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetType();
      if (rs.ok) {
        this.budgetTypes = rs.rows;
        this.budgetTypeId = this.budgetTypes ? this.budgetTypes[0].bgtype_id : null;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getPlanningHeaderInfo() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningHeaderInfo(this.planningHeaderId);
      if (rs.ok) {
        const data = rs.rows[0];
        this.planningYear = data.planning_year;
        this.planningName = data.planning_name;
        this.planningStatus = data.confirmed;
        this.totalAmount = data.planning_amount;
        this.planningTotal = data.planning_qty;
        this.refHeaderId = data.ref_hdr_id;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  async getPlanningDetail() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningDetail(this.planningHeaderId, this._uuid);
      if (rs.ok) {
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  async deletePlanningTmp(item: any) {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.deletePlanningTmp(item.tmp_id);
      if (rs.ok) {
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async savePlanning() {
    try {
      this.pmLoading.show();
      const _header = {
        planningHeaderId: this.planningHeaderId,
        planningYear: this.planningYear,
        totalAmount: this.totalAmount,
        planningName: this.planningName,
        planningMemo: this.planningMemo,
        confirmed: this.planningStatus,
        planningQty: this.planningTotal,
        refHeaderId: this.refHeaderId
      };
      const rs: any = await this.planningService.updatePlanning(_header, this._uuid);
      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/apps/planning']);
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  refreshPlanning(state: State) {
    this.offset = +state.page.from;
    this.getPlanningTmp();
  }

  async getPlanningTmp() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningTmp(this._uuid, this.query, this.genericType, this.perPage, this.offset);
      if (rs.ok) {
        this.plannings = rs.rows;
        this.planningTotal = rs.total;
        this.totalAmount = rs.amount;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async insertPlanningTmp(obj) {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.insertPlanningTmp(this._uuid, obj);
      if (rs.ok) {
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async updatePlanningTmp(obj) {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.updatePlanningTmp(this._uuid, obj);
      if (rs.ok) {
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  confirmPlanning() {
    this.planningStatus = 'Y';
    this.savePlanning();
  }

  async getPlanningHistory() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningHistory(this.planningHeaderId);
      if (rs.ok) {
        this.history = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  onClickAdjustPlanning() {
    this.adjustModal.show();
  }

  async processAdjustPlanning(obj) {
    try {
      this.pmLoading.show();
      let rs: any;
      if (obj.type === 'amount') {
        rs = await this.planningService.processAdjustAmount(this._uuid, obj.amount);
      } else {
        rs = await this.planningService.processAdjustPercent(this._uuid, obj.percent);
      }
      if (rs.ok) {
        this.planningMemo = obj.memo;
        this.alertService.success();
        this.adjustModal.hide();
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  enterSearch(event: any) {
    if (event.keyCode === 13) {
      this.offset = 0;
      this.getPlanningTmp();
    }
  }

  onClickExportPlanning() {
    const url = this.url + `/planning/excel/${this.planningHeaderId}?uuid=${this._uuid}&token=${this._token}`;
    window.open(url, '_blank');
  }

  onClickPrintReport() {
    const url = `${this.url}/planning/report/${this.planningHeaderId}?uuid=${this._uuid}&token=${this._token}`;
    this.htmlPreview.showReport(url);
  }

  onClickUploadPlanning() {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.uploadModal.show();
      })
      .catch(() => { });
  }

  async processUploadPlanning(obj) {
    try {
      this.pmLoading.show();
      const rs: any = await this.uploadingService.uploadPlanning(this._uuid, obj.file);
      if (rs.ok) {
        this.alertService.success();
        this.uploadModal.hide();
        this.getPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async onSelectGenericType(event) {
    this.genericType = event ? event.generic_type_id : '';
    this.getPlanningTmp();
  }

}

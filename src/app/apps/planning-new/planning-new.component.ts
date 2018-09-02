import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { SelectUnitComponent } from '../../directives/select-unit/select-unit.component';
import { SearchGenericComponent } from '../../directives/search-generic/search-generic.component';
import { SelectBidtypeComponent } from '../../directives/select-bidtype/select-bidtype.component';
import { BidType } from '../../interfaces/bid-type';
import { AlertService } from '../../services/alert.service';
import { PlanningService } from '../../services/planning.service';
import { LoadingComponent } from '../../modals/loading/loading.component';
import { AdjustPlanningComponent } from '../../modals/adjust-planning/adjust-planning.component';
import { CopyPlanningComponent } from '../../modals/copy-planning/copy-planning.component';
import { UploadExcelComponent } from '../../modals/upload-excel/upload-excel.component';
import { UploadingService } from '../../services/uploading.service';
import { DatagridPlanningComponent } from '../../directives/datagrid-planning/datagrid-planning.component';
import { MergePlanningComponent } from '../../modals/merge-planning/merge-planning.component';
import { BudgetService } from '../../services/budget.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
import { StandardService } from '../../services/standard.service';

@Component({
  selector: 'pm-planning-new',
  templateUrl: './planning-new.component.html',
  styles: []
})
export class PlanningNewComponent implements OnInit {
  @ViewChild('selectUnit') selectUnit: SelectUnitComponent;
  @ViewChild('selectBidType') selectBidType: SelectBidtypeComponent;
  @ViewChild('searchGeneric') searchGeneric: SearchGenericComponent;
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;
  @ViewChild('adjustModal') private adjustModal: AdjustPlanningComponent;
  @ViewChild('copyModal') private copyModal: CopyPlanningComponent;
  @ViewChild('uploadModal') private uploadModal: UploadExcelComponent;
  @ViewChild('dataGrid') private dataGrid: DatagridPlanningComponent;
  @ViewChild('mergeModal') private mergeModal: MergePlanningComponent;

  _uuid: any;

  years = [];
  plannings = [];
  budgetTypes = [];
  genericTypes = [];
  selectedGenericTypes = [];

  planningStatus = 'N';
  totalAmount = 0;
  planningName: any;
  planningMemo: any;
  planningYear: any = moment().get('year') + (moment().get('month') > 8 ? 1 : 0) + 1;
  oldPlanningYear: any;
  refHeaderId: any;
  query: any;
  genericType: any;
  budgetTypeId: any;
  opened = false;

  perPage = 10;
  offset = 0;
  planningTotal = 0;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private planningService: PlanningService,
    private uploadingService: UploadingService,
    private budgetService: BudgetService,
    private standardService: StandardService
  ) {
    this._uuid = uuid();
    console.log('_uuid', this._uuid);
  }

  ngOnInit() {
    const _min = new Date().getFullYear();
    this.years = Array.from(new Array(5), (x, i) => _min + i);
    this.oldPlanningYear = this.planningYear;
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

  async getGenericType() {
    try {
      const rs: any = await this.standardService.getGenericTypes();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error();
    }
  }

  enterSearch(event: any) {
    if (event.keyCode === 13) {
      this.offset = 0;
      this.getPlanningTmp();
    }
  }

  onFocusPlanningYear(event) {
    if (this.oldPlanningYear === this.planningYear) {
      this.oldPlanningYear = event.target.value;
    }
  }

  onChangePlanningYear(event) {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.planningYear = event.target.value;
        this.oldPlanningYear = event.target.value;
        this.callForecast();
      })
      .catch(() => {
        this.planningYear = this.oldPlanningYear;
      });
  }

  async callForecast() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.callForecast(this.planningYear);
      if (rs.ok) {
        this.clearPlanningTmp();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async clearPlanningTmp() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.clearPlanningTmp(this._uuid);
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
        planningYear: this.planningYear,
        totalAmount: this.totalAmount,
        planningName: this.planningName,
        planningMemo: this.planningMemo,
        planningQty: this.planningTotal,
        refHeaderId: this.refHeaderId,
        budgetTypeId: this.budgetTypeId
      };
      const rs: any = await this.planningService.insertPlanning(_header, this._uuid);
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

  async processForecast() {
    try {
      this.pmLoading.show();
      const genericTypeIds = [];
      _.forEach(this.selectedGenericTypes, (t) => {
        genericTypeIds.push(t.generic_type_id);
      });
      const rs: any = await this.planningService.processForecast(this.planningYear, this._uuid, genericTypeIds);
      if (rs.ok) {
        this.getPlanningTmp();
        this.opened = false;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async getPlanningTmp() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningTmp(this._uuid, this.query, this.genericType, this.perPage, this.offset);
      if (rs.ok) {
        this.plannings = rs.rows;
        this.planningTotal = rs.total;
        this.totalAmount = rs.amount || 0;
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

  onClickAdjustPlanning() {
    this.adjustModal.show();
  }

  onClickCopyPlanning() {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.getPlanningForCopy();
      })
      .catch(() => { });
  }

  onClickUploadPlanning() {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.uploadModal.show();
      })
      .catch(() => { });
  }

  onClickMergePlanning() {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.getPlanningForMerge();
      })
      .catch(() => { });
  }

  async getPlanningForMerge() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningHeader(this.planningYear, 'Y', null);
      if (rs.ok) {
        this.mergeModal.show(rs.rows);
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
  }

  async getPlanningForCopy() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningHeader(this.planningYear - 1, 'Y', null);
      if (rs.ok) {
        this.copyModal.show(rs.rows);
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.error();
      this.pmLoading.hide();
    }
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

  async processCopyPlanning(obj) {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.processCopyPercent(obj.headerId, obj.percent, this.planningYear, this._uuid);
      if (rs.ok) {
        this.alertService.success();
        this.copyModal.hide();
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

  async processMergePlanning(obj) {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.processMergePercent(obj.headerIds, this._uuid);
      if (rs.ok) {
        this.refHeaderId = obj.headerIds;
        this.alertService.success();
        this.mergeModal.hide();
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

  refreshPlanning(state: State) {
    this.offset = +state.page.from;
    this.getPlanningTmp();
  }

  async onSelectGenericType(event) {
    this.genericType = event ? event.generic_type_id : '';
    this.getPlanningTmp();
  }

  onClickProcessForecast() {
    this.alertService.confirm('รายการที่มีอยู่จะถูกลบ คุณต้องการทำรายการ ใช่หรือไม่?')
      .then(() => {
        this.getGenericType();
        this.selectedGenericTypes = [];
        this.opened = true;
      })
      .catch(() => { });
  }

}

import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { BudgetService } from '../../services/budget.service';
import { LoadingComponent } from '../../modals/loading/loading.component';

@Component({
  selector: 'pm-budget-sub-type',
  templateUrl: './budget-sub-type.component.html',
  styles: []
})
export class BudgetSubTypeComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;

  openModal = false;
  subTypes: any[] = [];
  subtypeId = 0;
  subtypeName = '';
  subtypeIsActive = true;

  constructor(
    private alertService: AlertService,
    private budgetService: BudgetService
  ) { }

  ngOnInit() {
    this.getSubtype();
  }

  async getSubtype() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetSubType();
      if (rs.ok) {
        this.subTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  addSubType() {
    this.subtypeId = 0;
    this.subtypeName = '';
    this.openModal = true;
  }

  editSubType(row) {
    this.subtypeId = row.bgtypesub_id;
    this.subtypeName = row.bgtypesub_name;
    this.openModal = true;
  }

  deleteSubType(row) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${row.bgtypesub_name}] ใช่หรือไม่?`)
      .then(async () => {
        try {
          this.pmLoading.show();
          const rs: any = await this.budgetService.deleteBudgetSubType(row.bgtypesub_id);
          if (rs.ok) {
            this.getSubtype();
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
          this.pmLoading.hide();
        } catch (error) {
          this.pmLoading.hide();
          this.alertService.serverError();
        }
      })
      .catch(() => { });
  }

  async saveBudgetSubtype() {
    try {
      this.pmLoading.show();
      const data = {
        bgtypesub_name: this.subtypeName
      };
      let rs: any;
      if (this.subtypeId) {
        rs = await this.budgetService.updateBudgetSubType(this.subtypeId, data);
      } else {
        rs = await this.budgetService.insertBudgetSubType(data);
      }
      if (rs.ok) {
        this.getSubtype();
        this.openModal = false;
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async setIsActive(id: any, active: any) {
    try {
      this.pmLoading.show();
      const status = active.target.checked ? 1 : 0;
      const rs: any = await this.budgetService.updateBudgetSubType(id, { isactive: status });
      if (rs.ok) {
        this.getSubtype();
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

}

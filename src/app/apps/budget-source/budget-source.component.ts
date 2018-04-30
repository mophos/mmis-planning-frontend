import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { AlertService } from '../../services/alert.service';
import { LoadingComponent } from '../../modals/loading/loading.component';

@Component({
  selector: 'pm-budget-source',
  templateUrl: './budget-source.component.html',
  styles: []
})
export class BudgetSourceComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;

  budgetSources: any[] = [];

  openModal = false;

  budgetSourceId: number;
  budgetSourceName: string;

  constructor(
    private budgetService: BudgetService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getBudgetSource();
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

  addBudgetSource() {
    this.budgetSourceId = null;
    this.budgetSourceName = null;
    this.openModal = true;
  }

  editBudgetSource(event) {
    this.budgetSourceId = event.bgsource_id;
    this.budgetSourceName = event.bgsource_name;
    this.openModal = true;
  }

  deleteBudgetSource(event) {
    this.alertService.confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่? [' + event.bgsource_name + ']')
      .then(async () => {
        try {
          this.pmLoading.show();
          const rs: any = await this.budgetService.deleteBudgetSource(event.bgsource_id);
          if (rs.ok) {
            this.getBudgetSource();
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

  async saveBudgetSource() {
    try {
      this.pmLoading.show();
      const data = {
        bgsource_name: this.budgetSourceName
      };
      let rs: any;
      if (this.budgetSourceId) {
        rs = await this.budgetService.updateBudgetSource(this.budgetSourceId, data);
      } else {
        rs = await this.budgetService.insertBudgetSource(data);
      }
      if (rs.ok) {
        this.getBudgetSource();
        this.alertService.success();
        this.openModal = false;
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
      const rs: any = await this.budgetService.updateBudgetSource(id, { isactive: status });
      if (rs.ok) {
        this.getBudgetSource();
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { AlertService } from '../../services/alert.service';
import { LoadingComponent } from '../../modals/loading/loading.component';

@Component({
  selector: 'pm-budget-type',
  templateUrl: './budget-type.component.html',
  styles: []
})
export class BudgetTypeComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;

  types: any[] = [];

  openModal = false;

  typeId: number;
  typeName: string;

  constructor(
    private budgetService: BudgetService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getBudgetType();
  }

  async getBudgetType() {
    try {
      this.pmLoading.show();
      const rs: any = await this.budgetService.getBudgetType();
      if (rs.ok) {
        this.types = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  addType() {
    this._initialBudgetType();
    this.openModal = true;
  }

  editType(p) {
    this._initialBudgetType();
    this.typeId = p.bgtype_id;
    this.typeName = p.bgtype_name;
    this.openModal = true;
  }

  deleteType(event) {
    this.alertService.confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่? [' + event.bgtype_name + ']')
      .then(async () => {
        try {
          this.pmLoading.show();
          const rs: any = await this.budgetService.deleteBudgetType(event.bgtype_id);
          if (rs.ok) {
            this.getBudgetType();
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

  async saveType() {
    const data = {
      bgtype_name: this.typeName
    };
    try {
      this.pmLoading.show();
      let rs: any;
      if (this.typeId) {
        rs = await this.budgetService.updateBudgetType(this.typeId, data);
      } else {
        rs = await this.budgetService.insertBudgetType(data);
      }
      if (rs.ok) {
        this.getBudgetType();
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

  private _initialBudgetType() {
    this.typeId = null;
    this.typeName = null;
  }

  async setIsActive(id: any, active: any) {
    try {
      this.pmLoading.show();
      const status = active.target.checked ? 1 : 0;
      const rs: any = await this.budgetService.updateBudgetType(id, { isactive: status });
      if (rs.ok) {
        this.getBudgetType();
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

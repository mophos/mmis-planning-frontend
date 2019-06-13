import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../modals/loading/loading.component';
import { PlanningService } from './../../services/planning.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'pm-planning',
  templateUrl: './planning.component.html',
  styles: []
})
export class PlanningComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;

  years = [];
  plannings = [];

  planningYear: any = moment().get('year') + (moment().get('month') > 8 ? 1 : 0);
  planningStatus: any = '';
  planningName: any = '';

  constructor(
    private planningService: PlanningService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPlanningYear();
    this.getPlanning();
  }

  async getPlanningYear() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningYear();
      if (rs.ok) {
        this.years = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  async getPlanning() {
    try {
      this.pmLoading.show();
      const rs: any = await this.planningService.getPlanningHeader(this.planningYear, this.planningStatus, this.planningName);
      if (rs.ok) {
        this.plannings = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.pmLoading.hide();
    }
  }

  onEditPlanning(planning: any) {
    const url = `/apps/planning-edit/${planning.planning_hdr_id}`;
    this.router.navigateByUrl(url);
  }

  async onRemovePlanning(planning: any) {
    try {
      this.alertService.confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่? [' + planning.planning_name + ']')
        .then(async () => {
          await this.planningService.removePlanging(planning.planning_hdr_id);
          const idx = _.findIndex(this.plannings, { 'planning_hdr_id': planning.planning_hdr_id });
          this.plannings.splice(idx, 1);
        })
        .catch(() => { });
    } catch (error) {

    }
  }
}

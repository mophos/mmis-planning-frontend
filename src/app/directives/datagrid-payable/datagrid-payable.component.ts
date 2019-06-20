import { AlertService } from './../../services/alert.service';
import { AccountPayableService } from './../../services/account-payable.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pm-datagrid-payable',
  templateUrl: './datagrid-payable.component.html',
  styles: []
})
export class DatagridPayableComponent implements OnInit {

  loading = true;
  list = [];
  @Input() public payableId: any;
  constructor(
    private accountPayableService: AccountPayableService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getDetail();
  }

  async getDetail() {
    try {
      const rs: any = await this.accountPayableService.getDetail(this.payableId);
      if (rs.ok) {
        this.list = rs.rows;
      } else {
        this.alertService.serverError();
      }
      this.loading = false;
    } catch (error) {
      this.alertService.serverError();
      this.loading = false;
    }
  }

}

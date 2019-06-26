import { AlertService } from './../../services/alert.service';
import { AccountPayableService } from './../../services/account-payable.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LoadingComponent } from '../../modals/loading/loading.component';

@Component({
  selector: 'pm-account-payable',
  templateUrl: './account-payable.component.html',
  styles: []
})
export class AccountPayableComponent implements OnInit {

  list = [];
  token: any;
  query = '';
  @ViewChild('htmlPreview') private htmlPreview: any;
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;
  constructor(
    @Inject('API_URL') private url: string,
    private accountPayableService: AccountPayableService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.getList();
  }

  enterSearch(e) {
    if (e.keyCode === 13) {
      this.getList();
    }
  }
  async getList() {
    try {
      this.pmLoading.show();
      const rs = await this.accountPayableService.getList(this.query);
      if (rs.ok) {
        this.list = rs.rows;
      } else {
        this.alertService.serverError();
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.error(error);
    }
  }

  printReport(payableId) {
    const url = `${this.url}/account-payable/report?payableId=${payableId}&token=${this.token}`;
    console.log(url);

    this.htmlPreview.showReport(url);
  }
}

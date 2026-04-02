import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { BidTypeService } from '../../services/bid-type.service';
import { StandardService } from '../../services/standard.service';
import { LoadingComponent } from '../../modals/loading/loading.component';

@Component({
  selector: 'pm-bid-type',
  templateUrl: './bid-type.component.html',
  styles: []
})
export class BidTypeComponent implements OnInit {
  @ViewChild('pmLoading') private pmLoading: LoadingComponent;

  rows: any[];
  modalInput = false;
  bidId: any;
  bidName: any;
  isActive = 1;
  coPurchaseId: any;
  coPurchaseItems: any[] = [];

  constructor(
    private alertService: AlertService,
    private bidTypeService: BidTypeService,
    private standardService: StandardService
  ) { }

  ngOnInit() {
    this.getBidType();
    this.getCoPurchase();
  }

  onClickAdd() {
    this.modalInput = true;
    this.bidId = null;
    this.isActive = 1;
    this.bidName = '';
    this.coPurchaseId = null;
  }

  onClickEdit(row) {
    this.bidId = row.bid_id;
    this.bidName = row.bid_name;
    this.isActive = row.isactive;
    this.coPurchaseId = row.co_purchase_id;
    this.modalInput = true;
  }

  onClickDelete(row) {
    this.alertService.confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่? [' + row.bid_name + ']')
      .then(async () => {
        try {
          this.pmLoading.show();
          const rs: any = await this.bidTypeService.deleteBidType(row.bid_id);
          if (rs.ok) {
            this.getBidType();
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

  async onClickSave() {
    const data = {
      bid_name: this.bidName,
      co_purchase_id: this.coPurchaseId || null
    };
    try {
      this.pmLoading.show();
      let rs: any;
      if (this.bidId) {
        rs = await this.bidTypeService.updateBidType(this.bidId, data);
      } else {
        rs = await this.bidTypeService.insertBidType(data);
      }
      if (rs.ok) {
        this.getBidType();
        this.alertService.success();
        this.modalInput = false;
      } else {
        this.alertService.error(rs.error);
      }
      this.pmLoading.hide();
    } catch (error) {
      this.pmLoading.hide();
      this.alertService.serverError();
    }
  }

  async getCoPurchase() {
    try {
      const rs: any = await this.standardService.getCoPurchase();
      if (rs.ok) {
        this.coPurchaseItems = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.serverError();
    }
  }

  async getBidType() {
    try {
      this.pmLoading.show();
      const rs: any = await this.bidTypeService.getBidType();
      if (rs.ok) {
        this.rows = rs.rows;
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
      const rs: any = await this.bidTypeService.updateBidType(id, { isactive: status });
      if (rs.ok) {
        this.getBidType();
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

  async setDefault(id: any, event: any) {
    try {
      this.pmLoading.show();
      const isDefault = event.target.checked ? 'Y' : 'N';
      const rs: any = await this.bidTypeService.updateDefault(id);
      if (rs.ok) {
        this.getBidType();
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

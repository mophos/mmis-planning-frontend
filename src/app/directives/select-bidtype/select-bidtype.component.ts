import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { StandardService } from '../../services/standard.service';
import { AlertService } from '../../services/alert.service';
import { BidType } from '../../interfaces/bid-type';

@Component({
  selector: 'pm-select-bidtype',
  templateUrl: './select-bidtype.component.html',
  styles: []
})
export class SelectBidtypeComponent implements OnInit {

  @Input() public genericId: any;
  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();


  loading = false;
  items: BidType[] = [];

  constructor(private standardService: StandardService, private alertService: AlertService) { }

  async ngOnInit() {
    if (this.genericId) {
      await this.getItems();
    }
  }

  setSelected(event: any) {
    const idx = _.findIndex(this.items, { bid_id: +event.target.value });
    if (idx > -1) {
      this.onSelect.emit(this.items[idx]);
    }
  }

  setSelectedBidType(bidTypeId: any) {
    this.selectedId = bidTypeId;
  }

  async getItems() {
    try {
      this.loading = true;
      let rs: any = await this.standardService.getBidTypes();
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.items, { bid_id: this.selectedId });
            if (idx > -1) {
              this.onSelect.emit(this.items[idx]);
            } else {
              this.onSelect.emit(this.items[0]);
            }
          } else {
            this.selectedId = this.items[0].bid_id;
            this.onSelect.emit(this.items[0]);
          }
        }

      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error()
    }
  }

  clearBidtype() {
    this.items = [];
    this.selectedId = null;
  }
}

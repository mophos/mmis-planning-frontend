import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { State } from '@clr/angular';
import { SelectUnitComponent } from '../../directives/select-unit/select-unit.component';
import { SearchGenericComponent } from '../../directives/search-generic/search-generic.component';
// import { SelectBidtypeComponent } from '../../directives/select-bidtype/select-bidtype.component';
// import { BidType } from '../../interfaces/bid-type';
import { AlertService } from '../../services/alert.service';
import { PlanningService } from '../../services/planning.service';
import * as moment from 'moment';

@Component({
  selector: 'pm-datagrid-planning',
  templateUrl: './datagrid-planning.component.html',
  styles: []
})
export class DatagridPlanningComponent implements OnInit {
  plannings = [];
  planningYear: any;
  total = 0;

  @Input('data') set setData(value: any) { this.plannings = value; }
  @Input('year') set setPlanningYear(value: any) { this.planningYear = value; }
  @Input('total') set setTotal(value: any) { this.total = value; }
  @Input('perPage') perPage = 10;

  @Output('insert') insert: EventEmitter<any> = new EventEmitter<any>();
  @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
  @Output('delete') delete: EventEmitter<any> = new EventEmitter<any>();
  @Output('refresh') refresh: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectUnit') selectUnit: SelectUnitComponent;
  // @ViewChild('selectBidType') selectBidType: SelectBidtypeComponent;
  @ViewChild('searchGeneric') searchGeneric: SearchGenericComponent;
  @ViewChild('pagination') pagination: any;

  selectedTmpId: any;
  selectedGenericId: any;
  selectedGenericName: any;
  selectedUnitGenericId: any;
  selectedUnitDesc: any = null;
  selectedCost: number = null;
  selectedConversionQty: number = null;
  selectedPrimaryUnitId: number = null;
  selectedRate3Year: number = null;
  selectedRate2Year: number = null;
  selectedRate1Year: number = null;
  selectedEstimateQty: number = null;
  selectedStockQty: number = null;
  selectedStockDate: any;
  selectedEstimateBuyQty: number = null;
  selectedQ1: number = null;
  selectedQ2: number = null;
  selectedQ3: number = null;
  selectedQ4: number = null;
  selectedQty: number = null;
  selectedAmount: number = null;
  // selectedBidTypeId: any;
  // selectedBidTypeName: any;
  selectedFreeze: any;
  selectedIsEdit: any;
  selectedGenericType: any;

  constructor(
    private alertService: AlertService,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
  }

  insertPlanningTmp(obj) {
    this.insert.emit(obj);
  }

  updatePlanningTmp(obj) {
    this.update.emit(obj);
  }

  onSelecteGeneric(event: any) {
    this.selectedGenericId = event ? event.generic_id : null;
    this.selectedGenericName = event ? event.generic_name : null;
    // this.selectedBidTypeId = event ? event.purchasing_method : null;
    this.selectedFreeze = event ? event.planning_freeze ? true : false : null;
    this.selectedGenericType = event ? event.generic_type_id : null;
    this.selectedUnitGenericId = event ? event.planning_unit_generic_id : null;

    this.selectUnit.setSelectedUnit(this.selectedUnitGenericId);
    this.selectUnit.getUnits(this.selectedGenericId);
    // this.selectBidType.setSelectedBidType(this.selectedBidTypeId);
    // this.selectBidType.getItems();
  }

  onChangeUnit(event: any) {
    console.log('event', event)
    this.selectedCost = event ? +event.cost : null;
    this.selectedUnitGenericId = event ? event.unit_generic_id : null;
    this.selectedConversionQty = event ? +event.qty : null;
    this.selectedUnitDesc = event ? `${event.from_unit_name} (${event.qty} ${event.to_unit_name})` : null;
    this.selectedPrimaryUnitId = event ? event.to_unit_id : null;
    this.getForecast();
  }

  // onChangeBidType(event: BidType) {
  //   this.selectedBidTypeId = event ? event.bid_id : null;
  //   this.selectedBidTypeName = event ? event.bid_name : null;
  // }

  onInputQty() {
    this.selectedQty = +this.selectedQ1 + +this.selectedQ2 + +this.selectedQ3 + +this.selectedQ4;
    this.selectedAmount = +this.selectedQty * +this.selectedCost;
  }

  onInputSelectedQty() {
    const result = this.selectedQty % 4;
    if (result) {
      const front = Math.floor(this.selectedQty / 4);
      this.selectedQ1 = this.selectedQ2 = this.selectedQ3 = this.selectedQ4 = front;
      if (result === 1) {
        this.selectedQ1 = this.selectedQ1 + 1;
      } else if (result === 2) {
        this.selectedQ1 = this.selectedQ1 + 1;
        this.selectedQ2 = this.selectedQ2 + 1;
      } else {
        this.selectedQ1 = this.selectedQ1 + 1;
        this.selectedQ2 = this.selectedQ2 + 1;
        this.selectedQ3 = this.selectedQ3 + 1;
      }
    } else {
      this.selectedQ1 = this.selectedQ2 = this.selectedQ3 = this.selectedQ4 = this.selectedQty / 4;
    }
    this.selectedAmount = +this.selectedQty * +this.selectedCost;
  }

  addItem() {
    if (this.selectedCost && this.selectedGenericId && this.selectedUnitGenericId) {
      let obj: any = {};
      obj.generic_id = this.selectedGenericId;
      obj.generic_name = this.selectedGenericName;
      obj.unit_generic_id = this.selectedUnitGenericId;
      obj.unit_desc = this.selectedUnitDesc;
      obj.unit_cost = this.selectedCost;
      obj.conversion_qty = this.selectedConversionQty;
      obj.primary_unit_id = this.selectedPrimaryUnitId;
      obj.rate_3_year = this.selectedRate3Year;
      obj.rate_2_year = this.selectedRate2Year;
      obj.rate_1_year = this.selectedRate1Year;
      obj.estimate_qty = this.selectedEstimateQty;
      obj.stock_qty = this.selectedStockQty;
      obj.inventory_date = this.selectedStockDate;
      obj.estimate_buy = this.selectedEstimateBuyQty;
      obj.q1 = this.selectedQ1;
      obj.q2 = this.selectedQ2;
      obj.q3 = this.selectedQ3;
      obj.q4 = this.selectedQ4;
      obj.qty = this.selectedQty; //q1+q2+q3+q4
      obj.amount = this.selectedAmount; //qty*unit_cost
      // obj.bid_type_id = this.selectedBidTypeId;
      // obj.bid_type_name = this.selectedBidTypeName;
      obj.freeze = this.selectedFreeze ? 'Y' : 'N';
      obj.is_edit = 'N';
      obj.generic_type_id = this.selectedGenericType;

      if (this.selectedTmpId) {
        obj.tmp_id = this.selectedTmpId;
        this.updatePlanningTmp(obj);
      } else {
        this.insertPlanningTmp(obj);
      }
      this.clearForm();
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  editItem(item: any) {
    this.selectUnit.onSelect.isStopped = true;
    this.plannings.forEach(v => {
      if (v.generic_id === item.generic_id) {
        v.is_edit = 'Y';
      } else {
        v.is_edit = 'N';
      }
    });
    this.selectedGenericId = item.generic_id;
    this.selectedGenericName = item.generic_name;
    this.searchGeneric.setSearchGeneric(item.generic_name);
    this.selectUnit.setSelectedUnit(item.unit_generic_id);
    this.selectUnit.getUnits(item.generic_id);
    this.selectedUnitGenericId = item.unit_generic_id;
    this.selectedUnitDesc = item.unit_desc;
    this.selectedConversionQty = item.conversion_qty;
    this.selectedCost = item.unit_cost;
    this.selectedPrimaryUnitId = item.primary_unit_id;
    this.selectedRate3Year = item.rate_3_year;
    this.selectedRate2Year = item.rate_3_year;
    this.selectedRate1Year = item.rate_3_year;
    this.selectedEstimateQty = item.estimate_qty;
    this.selectedStockQty = item.stock_qty;
    this.selectedStockDate = moment(item.inventory_date).format('YYYY-MM-DD HH:mm:ss');
    this.selectedEstimateBuyQty = item.estimate_buy;
    this.selectedQ1 = item.q1;
    this.selectedQ2 = item.q2;
    this.selectedQ3 = item.q3;
    this.selectedQ4 = item.q4;
    this.selectedQty = item.qty;
    this.selectedAmount = item.amount;
    // this.selectBidType.setSelectedBidType(item.bid_type_id);
    // this.selectBidType.getItems();
    // this.selectedBidTypeId = item.bid_type_id;
    this.selectedFreeze = item.freeze === 'Y' ? true : false;
    this.selectedIsEdit = 'Y';
    this.selectedTmpId = item.tmp_id;
    this.selectedGenericType = item.generic_type_id;
  }

  async deleteItem(item: any) {
    this.delete.emit(item);
  }

  async getForecast() {
    try {
      const rs: any = await this.planningService.getForecast(this.selectedGenericId, this.planningYear, this.selectedTmpId);
      if (rs.ok) {
        const data = rs.rows[0];
        this.selectedRate3Year = Math.round(data.sumy3 / this.selectedConversionQty);
        this.selectedRate2Year = Math.round(data.sumy2 / this.selectedConversionQty);
        this.selectedRate1Year = Math.round(data.sumy1 / this.selectedConversionQty);
        this.selectedEstimateQty = Math.round(data.sumy4 / this.selectedConversionQty);
        this.selectedStockQty = Math.round(data.stock_qty / this.selectedConversionQty);
        this.selectedStockDate = moment(data.process_date).format('YYYY-MM-DD HH:mm:ss');
        this.selectedEstimateBuyQty = Math.round(data.buy_qty / this.selectedConversionQty);
        this.selectedQ1 = Math.round(data.y4q1 / this.selectedConversionQty);
        this.selectedQ2 = Math.round(data.y4q2 / this.selectedConversionQty);
        this.selectedQ3 = Math.round(data.y4q4 / this.selectedConversionQty);
        this.selectedQ4 = Math.round(data.y4q4 / this.selectedConversionQty);
        this.selectedQty = this.selectedQ1 + this.selectedQ2 + this.selectedQ3 + this.selectedQ4;
        this.selectedAmount = this.selectedQty * this.selectedCost;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  refreshItem() {
    if (this.selectedTmpId) {
      let obj: any = {};
      obj.tmp_id = this.selectedTmpId;
      obj.is_edit = 'N';
      this.updatePlanningTmp(obj);
    }
    this.clearForm();
  }

  clearForm() {
    this.selectedTmpId = null;
    this.selectedGenericId = null;
    this.selectedUnitGenericId = null;
    this.selectedConversionQty = 0;
    this.selectedCost = null;
    this.selectedRate3Year = null;
    this.selectedRate2Year = null;
    this.selectedRate1Year = null;
    this.selectedEstimateQty = null;
    this.selectedStockQty = null;
    this.selectedEstimateBuyQty = null;
    this.selectedQ1 = null;
    this.selectedQ2 = null;
    this.selectedQ3 = null;
    this.selectedQ4 = null;
    this.selectedQty = null;
    this.selectedAmount = null;
    // this.selectedBidTypeId = null;
    this.selectedFreeze = null;
    this.selectedIsEdit = 'N';
    this.selectedGenericType = null;

    this.selectUnit.clearUnits();
    this.searchGeneric.clearGenericSearch();
    // this.selectBidType.clearBidtype();
  }

  refreshPlanning(state: State) {
    this.refresh.emit(state);
  }

}

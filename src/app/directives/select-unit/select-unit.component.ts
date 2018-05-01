import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { StandardService } from '../../services/standard.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'pm-select-unit',
  templateUrl: './select-unit.component.html',
  styles: []
})
export class SelectUnitComponent implements OnInit {


  @Input() public genericId: any;
  @Input() public showAdd: boolean;
  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  units = [];
  unitGenericId = null;
  loading = false;

  constructor(
    private standardService: StandardService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.genericId) {
      this.getUnits(this.genericId);
    }
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +event.target.value });
    if (idx > -1) {
      this.onSelect.emit(this.units[idx]);
    }
  }

  setSelectedUnit(unitGenericId: any) {
    this.selectedId = unitGenericId;
  }

  setGenericId(genericId: any) {
    this.units = [];
    this.genericId = genericId;
    this.getUnits(this.genericId);
  }

  async getUnits(genericId: any) {
    try {
      this.loading = true;
      this.units = [];
      const rs: any = await this.standardService.getUnitConversion(genericId);
      if (rs.ok) {
        this.units = rs.rows;
        this.loading = false;
        if (this.units.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.units, { unit_generic_id: this.selectedId });
            if (idx > -1) {
              this.onSelect.emit(this.units[idx]);
            } else {
              this.onSelect.emit(this.units[0]);
            }
          } else {
            this.selectedId = this.units[0].unit_generic_id;
            this.onSelect.emit(this.units[0]);
          }
        }
      } else {
        console.log(rs.error);
        this.loading = false;
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
    } finally {
      this.onSelect.isStopped = false;
    }

  }

  clearUnits() {
    this.genericId = null;
    this.units = [];
    this.selectedId = null;
    // this.modalUom.clearUnits();
  }

  successUnitModal(event) {
    this.getUnits(this.genericId);
  }

}

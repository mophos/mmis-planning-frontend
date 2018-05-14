import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StandardService } from '../../services/standard.service';
import { AlertService } from '../../services/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'pm-select-generic-type',
  templateUrl: './select-generic-type.component.html',
  styles: []
})
export class SelectGenericTypeComponent implements OnInit {

  @Output('select') select: EventEmitter<any> = new EventEmitter<any>();

  genericTypes = [];

  genericType = '';

  constructor(
    private standardService: StandardService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    this.getGenericType();
  }

  async getGenericType() {
    try {
      const rs: any = await this.standardService.getGenericTypes();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error();
    }
  }

  onChangeGenericType(event: any) {
    const idx = _.findIndex(this.genericTypes, { generic_type_id: +event.target.value });
    if (idx > -1) {
      this.select.emit(this.genericTypes[idx]);
    } else {
      this.select.emit();
    }
  }

}

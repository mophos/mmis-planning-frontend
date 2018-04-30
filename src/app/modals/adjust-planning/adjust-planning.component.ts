import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pm-adjust-planning',
  templateUrl: './adjust-planning.component.html',
  styles: []
})
export class AdjustPlanningComponent implements OnInit {

  @Output('adjust') adjust: EventEmitter<any> = new EventEmitter<any>();

  opened = false;
  adjustType = 'amount';
  disabledAmount = false;
  disabledPercent = true;
  adjustAmount: number;
  adjustPercent: number;
  adjustMemo: any;

  constructor() { }

  ngOnInit() {
  }

  onChangeAdjustType(event) {
    if (event === 'amount') {
      this.disabledAmount = false;
      this.disabledPercent = true;
      this.adjustPercent = null;
    } else {
      this.disabledAmount = true;
      this.disabledPercent = false;
      this.adjustAmount = null;
    }
  }

  processAdjustPlanning() {
    this.adjust.emit({
      type: this.adjustType,
      amount: this.adjustAmount,
      percent: this.adjustPercent,
      memo: this.adjustMemo
    });
  }

  show() {
    this.opened = true;
  }

  hide() {
    this.opened = false;
  }

}

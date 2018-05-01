import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pm-copy-planning',
  templateUrl: './copy-planning.component.html',
  styles: []
})
export class CopyPlanningComponent implements OnInit {
  @Output('copy') copy: EventEmitter<any> = new EventEmitter<any>();

  plannings = [];

  opened = false;
  headerIdForCopy: any;
  percentForCopy: number;

  constructor() { }

  ngOnInit() {
  }

  processCopyPlanning() {
    this.copy.emit({
      headerId: this.headerIdForCopy,
      percent: this.percentForCopy,
    });
  }

  show(data) {
    this.plannings = data;
    this.opened = true;
  }

  hide() {
    this.opened = false;
  }

}

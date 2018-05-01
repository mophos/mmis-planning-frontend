import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pm-merge-planning',
  templateUrl: './merge-planning.component.html',
  styles: []
})
export class MergePlanningComponent implements OnInit {
  @Output('merge') merge: EventEmitter<any> = new EventEmitter<any>();

  plannings = [];
  selected = [];

  opened = false;

  constructor() { }

  ngOnInit() {
  }

  processMergePlanning() {
    let headerIds = [];
    this.selected.forEach(e => {
      headerIds.push(e.planning_hdr_id);
    });
    this.merge.emit({
      headerIds: headerIds
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

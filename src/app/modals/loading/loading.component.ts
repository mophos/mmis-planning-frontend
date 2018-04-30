import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pm-loading',
  templateUrl: './loading.component.html',
  styles: []
})
export class LoadingComponent implements OnInit {

  opened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    setTimeout(() => {
      this.opened = true;
    }, 100);
  }

  hide() {
    setTimeout(() => {
      this.opened = false;
    }, 1000);
  }


}

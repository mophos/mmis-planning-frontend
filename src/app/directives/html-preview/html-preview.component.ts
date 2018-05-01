import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'pm-html-preview',
  templateUrl: './html-preview.component.html',
  styleUrls: ['./html-preview.component.css']
})
export class HtmlPreviewComponent implements OnInit {

  reportURL: any;
  isShow = false;

  constructor(private santizer: DomSanitizer) { }

  ngOnInit() {
  }

  showReport(url: any) {
    this.isShow = true;
    this.reportURL = this.santizer.bypassSecurityTrustResourceUrl(url);
  }

}

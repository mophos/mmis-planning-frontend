import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pm-upload-excel',
  templateUrl: './upload-excel.component.html',
  styles: []
})
export class UploadExcelComponent implements OnInit {
  @Output('upload') upload: EventEmitter<any> = new EventEmitter<any>();

  opened = false;
  file: any;
  fileName: any = null;

  constructor() { }

  ngOnInit() {
  }

  fileChangeEvent(fileInput: any) {
    this.file = <Array<File>>fileInput.target.files;
    this.fileName = this.file[0].name;
  }

  async doUploadFile() {
    this.upload.emit({
      file: this.file[0]
    });
  }

  show() {
    this.opened = true;
  }

  hide() {
    this.opened = false;
  }

}

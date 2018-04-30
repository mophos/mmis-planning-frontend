import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  private statuses = [{
    'id': 'N',
    'name': 'รอการยืนยัน'
  }, {
    'id': 'Y',
    'name': 'ยืนยันแล้ว'
  }];

  transform(value: any, args?: any): any {
    const status = this.statuses.filter(s => s.id === value);
    if (status.length) {
      return status[0].name;
    } else {
      return '-';
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toThaiDateTime'
})
export class ToThaiDateTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    moment.locale('th');
    if (moment(value).isValid()) {
      const thaiDate = `${moment(value).format('DD MMMM')} ${moment(value).get('year') + 543} ${moment(value).format('HH:mm:ss')}`;
      return thaiDate;
    } else {
      return '-';
    }

  }

}

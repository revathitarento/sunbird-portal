import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  /**
     * to create date format pipe
     *
     * @param {Date} value current Date
     *
     */
  transform(value: Date | moment.Moment | string | number): string {
    return momentConstructor(value).format('Do MMMM YYYY');
  }

}

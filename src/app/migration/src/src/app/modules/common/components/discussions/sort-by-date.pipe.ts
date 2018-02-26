
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ThreadDetailsComponent } from './thread-details/thread-details.component';
import { ThreadListComponent } from './thread-list/thread-list.component';



@Pipe({
  name: 'sortByDate'
})
@Injectable()
export class SortByDatePipe implements PipeTransform {

  transform(array: Array<any>, args: string, param): Array<any> {
    console.log('typeof args[0]:, param', typeof args[0], param);
    if (typeof args[0] === 'undefined') {
      return array;
    }

    const direction = args[0][0];


    array.sort((a: any, b: any) => {
      if (args !== 'like_count') {
        const column = args.replace('-', '');
        const left = Number(new Date(a[column]));
        const right = Number(new Date(b[column]));
        return (direction === '-') ? right - left : left - right;
      }
      if (args === 'like_count') {
        // return (sortOrder === "asc") ? a[args] - b[args] : b[args] - a[args];
        return b[args] - a[args];
      }
    });
    return array;
  }
}


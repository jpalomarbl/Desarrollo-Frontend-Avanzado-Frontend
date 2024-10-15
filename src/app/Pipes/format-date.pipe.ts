import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): unknown {
    // TODO 1
    let separator = '';

    switch (args[0]) {
      case 1:
        separator = '';
      break;

      case 2:
        separator = ' / ';
      break;

      case 3:
        separator = '/';
      break;

      case 4:
        separator = '-';
      break;

      default:
        console.log('First argument must be a number between 1 and 4.');
        return value;
      break;
    }

    if (typeof value === 'string') {
      value = new Date(value);
    }

    let formatedDate = value.getDate() + separator;

    if ((+value.getMonth() + 1) < 10) {
      formatedDate += 0;
    }

    formatedDate += (value.getMonth() + 1) + separator + value.getFullYear();

    return formatedDate;
  }
}

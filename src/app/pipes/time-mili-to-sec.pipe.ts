import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeMilToSec' })
export default class TimeMilToSecPipe implements PipeTransform {
  transform(value: number) {
    return value / 1000;
  }
}

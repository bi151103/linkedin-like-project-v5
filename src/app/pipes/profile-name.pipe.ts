import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profileName',
})
export default class ProfileNamePipe implements PipeTransform {
  transform(value: { firstName?: string; lastName?: string }) {
    const { firstName, lastName } = value;
    if (firstName && lastName) {
      return firstName + ' ' + lastName;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return '-';
    }
  }
}

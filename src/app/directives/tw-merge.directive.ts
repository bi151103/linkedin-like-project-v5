import { Pipe, PipeTransform } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Pipe({ name: 'twMerge' })
export default class TwMergePipe implements PipeTransform {
  transform = twMerge;
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertRelativeDate' })
export default class ConvertRelativeDatePipe implements PipeTransform {
  transform(value: string): string {
    const target = new Date(value);
    const now = new Date();

    const diffMs = target.getTime() - now.getTime();
    const diffSeconds = Math.abs(diffMs) / 1000;

    if (diffSeconds < 60) {
      return `${Math.floor(diffSeconds)}s`;
    }

    const minutes = diffSeconds / 60;
    if (minutes < 60) {
      return `${Math.floor(minutes)}m`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
      return `${Math.floor(hours)}h`;
    }

    const days = hours / 24;
    if (days < 7) {
      return `${Math.floor(days)}d`;
    }

    const weeks = days / 7;
    if (weeks < 4) {
      return `${Math.floor(weeks)}w`;
    }

    const months = days / 30.44;
    if (months < 12) {
      return `${Math.floor(months)}mo`;
    }

    const years = days / 365.25;
    return `${Math.floor(years)}y`;
  }
}

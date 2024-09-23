import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'startOnlyWithAlphabets' })
export class StartOnlyWithAlphabetsPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/[^a-zA-Z]/g, ''); // Adjust the regex to suit your needs
  }
}

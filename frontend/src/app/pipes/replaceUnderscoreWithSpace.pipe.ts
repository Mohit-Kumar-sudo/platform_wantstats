import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'replaceUnderscoreWithSpace'})
export class ReplaceUnderscoreWithSpacePipe implements PipeTransform {

  transform(data: any): any {
    let data1 = data;
    if (data) {
      data1 = data.toString().replace(/_/g, ' ');
    }

    return data1;
  }
}

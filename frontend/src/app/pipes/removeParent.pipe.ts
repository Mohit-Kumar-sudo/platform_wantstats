import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'removeParent'})
export class RemoveParentPipe implements PipeTransform {

  transform(data: any): any {
    let data1 = data;
    if (data) {
      data1 = data.toString().replace(/parent/g, ' ');
    }

    return data1;
  }
}

import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'changeTableCAGRYear'})
export class ChangeTableCAGRYearPipe implements PipeTransform {

  transform(data: any, baseYear : any): any {
    let data1 = data;

    if(data1.includes('CAGR (%) (')){
        let newData = data1.split('-');
        if(newData && newData.length){
            baseYear =parseInt(baseYear, 10)+1
            newData[0] = newData[0].replace(/\([0-9]+/, '(' + baseYear)
            data1 = newData.join('-')
            return data1
        }else{
            return data1;
        }
    }else{
        return data1;
    }
  }
}
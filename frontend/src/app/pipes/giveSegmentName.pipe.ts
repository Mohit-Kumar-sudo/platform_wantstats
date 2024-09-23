import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { MarketEstimationService } from 'src/app/services/market-estimation.service';


@Pipe({ name: 'giveSegmentName' })
export class GiveSegmentNamePipe implements PipeTransform {

    constructor(private MarketEstimationService : MarketEstimationService){}

    transform(data: any, segments): any {
        let data1 = data.split("_").join(" ");
      if (data) {
        segments.forEach(d => {
          let replaceTxt;
          let parentSeg = _.find(segments, ['id', d.pid]);
          if (parentSeg)
            replaceTxt = d.name.replace(parentSeg.name, '').replace('_', '');

          if (data1 == this.MarketEstimationService.replacedTxtWithSegName(d.name)) {
            data1 = data1.replace(data1, replaceTxt);
          }
        })
      }

        return data1;
    }
}

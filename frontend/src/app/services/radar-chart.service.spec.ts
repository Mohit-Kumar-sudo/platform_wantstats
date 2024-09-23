import { TestBed } from '@angular/core/testing';

import { RadarChartService } from './radar-chart.service';

describe('RadarChartService', () => {
  let service: RadarChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadarChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

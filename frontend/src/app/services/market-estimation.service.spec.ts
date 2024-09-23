import { TestBed } from '@angular/core/testing';

import { MarketEstimationService } from './market-estimation.service';

describe('MarketEstimationService', () => {
  let service: MarketEstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketEstimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

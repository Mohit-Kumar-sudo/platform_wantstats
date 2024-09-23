import { TestBed } from '@angular/core/testing';

import { MarketBreakupService } from './market-breakup.service';

describe('MarketBreakupService', () => {
  let service: MarketBreakupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketBreakupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

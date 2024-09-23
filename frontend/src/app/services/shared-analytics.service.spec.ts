import { TestBed } from '@angular/core/testing';

import { SharedAnalyticsService } from './shared-analytics.service';

describe('SharedAnalyticsService', () => {
  let service: SharedAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

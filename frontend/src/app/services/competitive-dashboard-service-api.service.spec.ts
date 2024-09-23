import { TestBed } from '@angular/core/testing';

import { CompetitiveDashboardServiceApiService } from './competitive-dashboard-service-api.service';

describe('CompetitiveDashboardServiceApiService', () => {
  let service: CompetitiveDashboardServiceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitiveDashboardServiceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

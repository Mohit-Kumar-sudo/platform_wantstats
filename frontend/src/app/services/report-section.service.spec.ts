import { TestBed } from '@angular/core/testing';

import { ReportSectionService } from './report-section.service';

describe('ReportSectionService', () => {
  let service: ReportSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

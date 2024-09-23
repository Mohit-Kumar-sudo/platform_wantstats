import { TestBed } from '@angular/core/testing';

import { CompanyprofileService } from './companyprofile.service';

describe('CompanyprofileService', () => {
  let service: CompanyprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

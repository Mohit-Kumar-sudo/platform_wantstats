import { TestBed } from '@angular/core/testing';

import { SecEdgarApiService } from './sec-edgar-api.service';

describe('SecEdgarApiService', () => {
  let service: SecEdgarApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecEdgarApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

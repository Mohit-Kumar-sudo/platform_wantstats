import { TestBed } from '@angular/core/testing';

import { PortersApiService } from './porters-api.service';

describe('PortersApiService', () => {
  let service: PortersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

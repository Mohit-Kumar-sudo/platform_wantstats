import { TestBed } from '@angular/core/testing';

import { SupplyChainApiService } from './supply-chain-api.service';

describe('SupplyChainApiService', () => {
  let service: SupplyChainApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyChainApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

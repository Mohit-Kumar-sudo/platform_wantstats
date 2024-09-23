import { TestBed } from '@angular/core/testing';

import { SharedInterconnectService } from './shared-interconnect.service';

describe('SharedInterconnectService', () => {
  let service: SharedInterconnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedInterconnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

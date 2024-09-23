import { TestBed } from '@angular/core/testing';

import { OutputResultService } from './output-result.service';

describe('OutputResultService', () => {
  let service: OutputResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutputResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

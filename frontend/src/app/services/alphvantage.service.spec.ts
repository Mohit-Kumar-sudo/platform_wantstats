import { TestBed } from '@angular/core/testing';

import { AlphvantageService } from './alphvantage.service';

describe('AlphvantageService', () => {
  let service: AlphvantageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphvantageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

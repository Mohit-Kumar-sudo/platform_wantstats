import { TestBed } from '@angular/core/testing';

import { GoogleFinanceNewsService } from './google-finance-news.service';

describe('GoogleFinanceNewsService', () => {
  let service: GoogleFinanceNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleFinanceNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

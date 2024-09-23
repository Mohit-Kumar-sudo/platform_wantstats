import { TestBed } from '@angular/core/testing';

import { TitleDataService } from './title-data.service';

describe('TitleDataService', () => {
  let service: TitleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

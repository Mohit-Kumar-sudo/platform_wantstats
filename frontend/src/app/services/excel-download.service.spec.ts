import { TestBed } from '@angular/core/testing';

import { ExcelDownloadService } from './excel-download.service';

describe('ExcelDownloadService', () => {
  let service: ExcelDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorywiseReportComponent } from './categorywise-report.component';

describe('CategorywiseReportComponent', () => {
  let component: CategorywiseReportComponent;
  let fixture: ComponentFixture<CategorywiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorywiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorywiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

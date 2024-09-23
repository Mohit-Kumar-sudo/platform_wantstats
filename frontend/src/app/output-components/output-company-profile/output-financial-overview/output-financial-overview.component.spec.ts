import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputFinancialOverviewComponent } from './output-financial-overview.component';

describe('OutputFinancialOverviewComponent', () => {
  let component: OutputFinancialOverviewComponent;
  let fixture: ComponentFixture<OutputFinancialOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputFinancialOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputFinancialOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

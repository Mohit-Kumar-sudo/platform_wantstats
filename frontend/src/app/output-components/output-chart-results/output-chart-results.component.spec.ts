import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputChartResultsComponent } from './output-chart-results.component';

describe('OutputChartResultsComponent', () => {
  let component: OutputChartResultsComponent;
  let fixture: ComponentFixture<OutputChartResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputChartResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputChartResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

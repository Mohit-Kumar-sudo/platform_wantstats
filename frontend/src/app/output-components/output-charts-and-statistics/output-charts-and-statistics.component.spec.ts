import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputChartsAndStatisticsComponent } from './output-charts-and-statistics.component';

describe('OutputChartsAndStatisticsComponent', () => {
  let component: OutputChartsAndStatisticsComponent;
  let fixture: ComponentFixture<OutputChartsAndStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputChartsAndStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputChartsAndStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

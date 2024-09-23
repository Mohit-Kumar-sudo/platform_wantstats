import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonChartContainerComponent } from './common-chart-container.component';

describe('CommonChartContainerComponent', () => {
  let component: CommonChartContainerComponent;
  let fixture: ComponentFixture<CommonChartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonChartContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartResultsComponent } from './chart-results.component';

describe('ChartResultsComponent', () => {
  let component: ChartResultsComponent;
  let fixture: ComponentFixture<ChartResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

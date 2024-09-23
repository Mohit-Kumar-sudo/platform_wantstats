import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMarketInsightsComponent } from './mi-market-insights.component';

describe('MiMarketInsightsComponent', () => {
  let component: MiMarketInsightsComponent;
  let fixture: ComponentFixture<MiMarketInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiMarketInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiMarketInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

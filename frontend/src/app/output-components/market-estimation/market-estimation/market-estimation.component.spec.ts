import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketEstimationComponent } from './market-estimation.component';

describe('MarketEstimationComponent', () => {
  let component: MarketEstimationComponent;
  let fixture: ComponentFixture<MarketEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketEstimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketFactorHomeComponent } from './market-factor-home.component';

describe('MarketFactorHomeComponent', () => {
  let component: MarketFactorHomeComponent;
  let fixture: ComponentFixture<MarketFactorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketFactorHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketFactorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

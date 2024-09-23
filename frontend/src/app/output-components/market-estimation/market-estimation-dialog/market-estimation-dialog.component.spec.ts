import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketEstimationDialogComponent } from './market-estimation-dialog.component';

describe('MarketEstimationDialogComponent', () => {
  let component: MarketEstimationDialogComponent;
  let fixture: ComponentFixture<MarketEstimationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketEstimationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketEstimationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

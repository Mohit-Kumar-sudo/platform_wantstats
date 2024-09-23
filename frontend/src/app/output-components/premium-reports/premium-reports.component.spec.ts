import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumReportsComponent } from './premium-reports.component';

describe('PremiumReportsComponent', () => {
  let component: PremiumReportsComponent;
  let fixture: ComponentFixture<PremiumReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

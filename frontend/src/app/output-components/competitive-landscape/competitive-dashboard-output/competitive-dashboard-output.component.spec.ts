import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveDashboardOutputComponent } from './competitive-dashboard-output.component';

describe('CompetitiveDashboardOutputComponent', () => {
  let component: CompetitiveDashboardOutputComponent;
  let fixture: ComponentFixture<CompetitiveDashboardOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveDashboardOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveDashboardOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

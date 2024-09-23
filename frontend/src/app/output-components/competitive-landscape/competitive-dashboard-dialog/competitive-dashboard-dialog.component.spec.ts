import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveDashboardDialogComponent } from './competitive-dashboard-dialog.component';

describe('CompetitiveDashboardDialogComponent', () => {
  let component: CompetitiveDashboardDialogComponent;
  let fixture: ComponentFixture<CompetitiveDashboardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveDashboardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveDashboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSaveComponent } from './dashboard-save.component';

describe('DashboardSaveComponent', () => {
  let component: DashboardSaveComponent;
  let fixture: ComponentFixture<DashboardSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

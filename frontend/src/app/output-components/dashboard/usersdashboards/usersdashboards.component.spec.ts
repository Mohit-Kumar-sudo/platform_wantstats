import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersdashboardsComponent } from './usersdashboards.component';

describe('UsersdashboardsComponent', () => {
  let component: UsersdashboardsComponent;
  let fixture: ComponentFixture<UsersdashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersdashboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersdashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

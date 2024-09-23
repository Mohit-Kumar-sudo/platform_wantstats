import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDbComponent } from './leads-db.component';

describe('LeadsDbComponent', () => {
  let component: LeadsDbComponent;
  let fixture: ComponentFixture<LeadsDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsDbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

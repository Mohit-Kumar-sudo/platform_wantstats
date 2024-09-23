import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDataComponent } from './leads-data.component';

describe('LeadsDataComponent', () => {
  let component: LeadsDataComponent;
  let fixture: ComponentFixture<LeadsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

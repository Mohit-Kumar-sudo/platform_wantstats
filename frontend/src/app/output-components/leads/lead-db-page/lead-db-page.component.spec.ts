import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDbPageComponent } from './lead-db-page.component';

describe('LeadDbPageComponent', () => {
  let component: LeadDbPageComponent;
  let fixture: ComponentFixture<LeadDbPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadDbPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDbPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

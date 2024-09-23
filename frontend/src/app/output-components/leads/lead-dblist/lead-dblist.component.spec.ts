import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDblistComponent } from './lead-dblist.component';

describe('LeadDblistComponent', () => {
  let component: LeadDblistComponent;
  let fixture: ComponentFixture<LeadDblistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadDblistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

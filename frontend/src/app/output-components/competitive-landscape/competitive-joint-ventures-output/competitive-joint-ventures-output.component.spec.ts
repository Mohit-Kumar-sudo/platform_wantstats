import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveJointVenturesOutputComponent } from './competitive-joint-ventures-output.component';

describe('CompetitiveJointVenturesOutputComponent', () => {
  let component: CompetitiveJointVenturesOutputComponent;
  let fixture: ComponentFixture<CompetitiveJointVenturesOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveJointVenturesOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveJointVenturesOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

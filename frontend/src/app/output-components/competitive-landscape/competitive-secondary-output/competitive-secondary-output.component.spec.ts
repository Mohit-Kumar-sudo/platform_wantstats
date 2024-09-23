import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveSecondaryOutputComponent } from './competitive-secondary-output.component';

describe('CompetitiveSecondaryOutputComponent', () => {
  let component: CompetitiveSecondaryOutputComponent;
  let fixture: ComponentFixture<CompetitiveSecondaryOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveSecondaryOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveSecondaryOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

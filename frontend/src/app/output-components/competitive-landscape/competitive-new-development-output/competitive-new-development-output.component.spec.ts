import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveNewDevelopmentOutputComponent } from './competitive-new-development-output.component';

describe('CompetitiveNewDevelopmentOutputComponent', () => {
  let component: CompetitiveNewDevelopmentOutputComponent;
  let fixture: ComponentFixture<CompetitiveNewDevelopmentOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveNewDevelopmentOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveNewDevelopmentOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

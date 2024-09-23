import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveKeyDevelopmentStrategyOutputComponent } from './competitive-key-development-strategy-output.component';

describe('CompetitiveKeyDevelopmentStrategyOutputComponent', () => {
  let component: CompetitiveKeyDevelopmentStrategyOutputComponent;
  let fixture: ComponentFixture<CompetitiveKeyDevelopmentStrategyOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveKeyDevelopmentStrategyOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveKeyDevelopmentStrategyOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

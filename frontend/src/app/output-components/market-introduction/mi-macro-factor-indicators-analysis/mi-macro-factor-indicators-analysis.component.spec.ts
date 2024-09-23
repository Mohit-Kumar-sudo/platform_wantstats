import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMacroFactorIndicatorsAnalysisComponent } from './mi-macro-factor-indicators-analysis.component';

describe('MiMacroFactorIndicatorsAnalysisComponent', () => {
  let component: MiMacroFactorIndicatorsAnalysisComponent;
  let fixture: ComponentFixture<MiMacroFactorIndicatorsAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiMacroFactorIndicatorsAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiMacroFactorIndicatorsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

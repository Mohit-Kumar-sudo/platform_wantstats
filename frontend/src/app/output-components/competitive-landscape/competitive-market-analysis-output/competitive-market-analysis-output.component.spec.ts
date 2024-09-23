import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveMarketAnalysisOutputComponent } from './competitive-market-analysis-output.component';

describe('CompetitiveMarketAnalysisOutputComponent', () => {
  let component: CompetitiveMarketAnalysisOutputComponent;
  let fixture: ComponentFixture<CompetitiveMarketAnalysisOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveMarketAnalysisOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveMarketAnalysisOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

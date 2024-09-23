import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSwotAnalysisComponent } from './output-swot-analysis.component';

describe('OutputSwotAnalysisComponent', () => {
  let component: OutputSwotAnalysisComponent;
  let fixture: ComponentFixture<OutputSwotAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputSwotAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputSwotAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

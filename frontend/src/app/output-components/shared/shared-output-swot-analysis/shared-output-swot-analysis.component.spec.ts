import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOutputSwotAnalysisComponent } from './shared-output-swot-analysis.component';

describe('SharedOutputSwotAnalysisComponent', () => {
  let component: SharedOutputSwotAnalysisComponent;
  let fixture: ComponentFixture<SharedOutputSwotAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedOutputSwotAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedOutputSwotAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

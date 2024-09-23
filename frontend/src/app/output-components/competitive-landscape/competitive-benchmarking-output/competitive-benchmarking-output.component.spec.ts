import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveBenchmarkingOutputComponent } from './competitive-benchmarking-output.component';

describe('CompetitiveBenchmarkingOutputComponent', () => {
  let component: CompetitiveBenchmarkingOutputComponent;
  let fixture: ComponentFixture<CompetitiveBenchmarkingOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveBenchmarkingOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveBenchmarkingOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

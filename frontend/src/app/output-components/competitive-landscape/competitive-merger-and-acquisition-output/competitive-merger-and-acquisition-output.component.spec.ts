import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveMergerAndAcquisitionOutputComponent } from './competitive-merger-and-acquisition-output.component';

describe('CompetitiveMergerAndAcquisitionOutputComponent', () => {
  let component: CompetitiveMergerAndAcquisitionOutputComponent;
  let fixture: ComponentFixture<CompetitiveMergerAndAcquisitionOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveMergerAndAcquisitionOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveMergerAndAcquisitionOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

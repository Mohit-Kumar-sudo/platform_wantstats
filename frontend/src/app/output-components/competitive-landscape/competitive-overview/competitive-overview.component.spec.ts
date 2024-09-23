import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveOverviewComponent } from './competitive-overview.component';

describe('CompetitiveOverviewComponent', () => {
  let component: CompetitiveOverviewComponent;
  let fixture: ComponentFixture<CompetitiveOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

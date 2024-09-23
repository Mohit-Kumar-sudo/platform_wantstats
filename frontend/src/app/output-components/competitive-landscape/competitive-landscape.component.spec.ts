import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitiveLandscapeComponent } from './competitive-landscape.component';

describe('CompetitiveLandscapeComponent', () => {
  let component: CompetitiveLandscapeComponent;
  let fixture: ComponentFixture<CompetitiveLandscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitiveLandscapeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitiveLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

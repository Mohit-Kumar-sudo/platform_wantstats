import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardcodesSuggestionComponent } from './hardcodes-suggestion.component';

describe('HardcodesSuggestionComponent', () => {
  let component: HardcodesSuggestionComponent;
  let fixture: ComponentFixture<HardcodesSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardcodesSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardcodesSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

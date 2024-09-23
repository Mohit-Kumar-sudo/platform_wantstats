import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardcodeSuggestionComponent } from './hardcode-suggestion.component';

describe('HardcodeSuggestionComponent', () => {
  let component: HardcodeSuggestionComponent;
  let fixture: ComponentFixture<HardcodeSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardcodeSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardcodeSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

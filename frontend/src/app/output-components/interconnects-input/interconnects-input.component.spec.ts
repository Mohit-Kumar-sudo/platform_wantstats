import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterconnectsInputComponent } from './interconnects-input.component';

describe('InterconnectsInputComponent', () => {
  let component: InterconnectsInputComponent;
  let fixture: ComponentFixture<InterconnectsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterconnectsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterconnectsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

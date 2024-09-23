import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroctDriverContainerComponent } from './droct-driver-container.component';

describe('DroctDriverContainerComponent', () => {
  let component: DroctDriverContainerComponent;
  let fixture: ComponentFixture<DroctDriverContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroctDriverContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DroctDriverContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

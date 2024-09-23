import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversOutputDialogComponent } from './drivers-output-dialog.component';

describe('DriversOutputDialogComponent', () => {
  let component: DriversOutputDialogComponent;
  let fixture: ComponentFixture<DriversOutputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversOutputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversOutputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

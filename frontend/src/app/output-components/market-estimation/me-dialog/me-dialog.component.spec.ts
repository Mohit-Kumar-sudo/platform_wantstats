import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeDialogComponent } from './me-dialog.component';

describe('MeDialogComponent', () => {
  let component: MeDialogComponent;
  let fixture: ComponentFixture<MeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

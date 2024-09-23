import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortersOutputDialogComponent } from './porters-output-dialog.component';

describe('PortersOutputDialogComponent', () => {
  let component: PortersOutputDialogComponent;
  let fixture: ComponentFixture<PortersOutputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortersOutputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortersOutputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

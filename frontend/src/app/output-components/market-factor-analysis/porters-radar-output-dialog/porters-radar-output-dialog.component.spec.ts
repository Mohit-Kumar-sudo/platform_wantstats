import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortersRadarOutputDialogComponent } from './porters-radar-output-dialog.component';

describe('PortersRadarOutputDialogComponent', () => {
  let component: PortersRadarOutputDialogComponent;
  let fixture: ComponentFixture<PortersRadarOutputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortersRadarOutputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortersRadarOutputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

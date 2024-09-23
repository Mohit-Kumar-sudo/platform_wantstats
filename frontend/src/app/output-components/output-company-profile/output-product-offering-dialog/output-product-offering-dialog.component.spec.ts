import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputProductOfferingDialogComponent } from './output-product-offering-dialog.component';

describe('OutputProductOfferingDialogComponent', () => {
  let component: OutputProductOfferingDialogComponent;
  let fixture: ComponentFixture<OutputProductOfferingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputProductOfferingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputProductOfferingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

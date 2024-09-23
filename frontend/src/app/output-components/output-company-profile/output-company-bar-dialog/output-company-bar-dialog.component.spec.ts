import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCompanyBarDialogComponent } from './output-company-bar-dialog.component';

describe('OutputCompanyBarDialogComponent', () => {
  let component: OutputCompanyBarDialogComponent;
  let fixture: ComponentFixture<OutputCompanyBarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputCompanyBarDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputCompanyBarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

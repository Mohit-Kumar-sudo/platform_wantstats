import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSwotDialogComponent } from './output-swot-dialog.component';

describe('OutputSwotDialogComponent', () => {
  let component: OutputSwotDialogComponent;
  let fixture: ComponentFixture<OutputSwotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputSwotDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputSwotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

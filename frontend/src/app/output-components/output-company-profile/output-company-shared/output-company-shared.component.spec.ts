import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCompanySharedComponent } from './output-company-shared.component';

describe('OutputCompanySharedComponent', () => {
  let component: OutputCompanySharedComponent;
  let fixture: ComponentFixture<OutputCompanySharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputCompanySharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputCompanySharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

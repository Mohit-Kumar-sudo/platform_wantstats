import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCompaniesComponent } from './output-companies.component';

describe('OutputCompaniesComponent', () => {
  let component: OutputCompaniesComponent;
  let fixture: ComponentFixture<OutputCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

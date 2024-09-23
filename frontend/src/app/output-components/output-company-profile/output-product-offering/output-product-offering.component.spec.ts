import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputProductOfferingComponent } from './output-product-offering.component';

describe('OutputProductOfferingComponent', () => {
  let component: OutputProductOfferingComponent;
  let fixture: ComponentFixture<OutputProductOfferingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputProductOfferingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputProductOfferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

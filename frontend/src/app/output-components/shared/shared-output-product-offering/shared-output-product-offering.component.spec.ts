import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOutputProductOfferingComponent } from './shared-output-product-offering.component';

describe('SharedOutputProductOfferingComponent', () => {
  let component: SharedOutputProductOfferingComponent;
  let fixture: ComponentFixture<SharedOutputProductOfferingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedOutputProductOfferingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedOutputProductOfferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

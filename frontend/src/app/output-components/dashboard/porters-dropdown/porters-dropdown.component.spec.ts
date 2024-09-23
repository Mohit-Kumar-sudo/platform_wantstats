import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortersDropdownComponent } from './porters-dropdown.component';

describe('PortersDropdownComponent', () => {
  let component: PortersDropdownComponent;
  let fixture: ComponentFixture<PortersDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortersDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortersDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

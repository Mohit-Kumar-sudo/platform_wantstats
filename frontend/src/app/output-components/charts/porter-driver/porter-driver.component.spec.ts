import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorterDriverComponent } from './porter-driver.component';

describe('PorterDriverComponent', () => {
  let component: PorterDriverComponent;
  let fixture: ComponentFixture<PorterDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorterDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorterDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSecondaryDataComponent } from './shared-secondary-data.component';

describe('SharedSecondaryDataComponent', () => {
  let component: SharedSecondaryDataComponent;
  let fixture: ComponentFixture<SharedSecondaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSecondaryDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSecondaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

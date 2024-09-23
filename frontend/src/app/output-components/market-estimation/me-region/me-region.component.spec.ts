import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeRegionComponent } from './me-region.component';

describe('MeRegionComponent', () => {
  let component: MeRegionComponent;
  let fixture: ComponentFixture<MeRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeRegionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

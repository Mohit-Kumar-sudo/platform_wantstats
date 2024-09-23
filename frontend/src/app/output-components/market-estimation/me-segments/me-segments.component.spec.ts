import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeSegmentsComponent } from './me-segments.component';

describe('MeSegmentsComponent', () => {
  let component: MeSegmentsComponent;
  let fixture: ComponentFixture<MeSegmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeSegmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

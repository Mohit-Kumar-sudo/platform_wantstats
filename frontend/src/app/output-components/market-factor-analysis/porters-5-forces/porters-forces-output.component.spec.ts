import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortersForcesOutputComponent } from './porters-forces-output.component';

describe('PortersForcesOutputComponent', () => {
  let component: PortersForcesOutputComponent;
  let fixture: ComponentFixture<PortersForcesOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortersForcesOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortersForcesOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

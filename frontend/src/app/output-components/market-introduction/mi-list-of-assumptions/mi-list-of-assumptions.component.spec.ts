import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiListOfAssumptionsComponent } from './mi-list-of-assumptions.component';

describe('MiListOfAssumptionsComponent', () => {
  let component: MiListOfAssumptionsComponent;
  let fixture: ComponentFixture<MiListOfAssumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiListOfAssumptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiListOfAssumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

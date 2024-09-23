import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarChartsComponent } from './top-bar-charts.component';

describe('TopBarChartsComponent', () => {
  let component: TopBarChartsComponent;
  let fixture: ComponentFixture<TopBarChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBarChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

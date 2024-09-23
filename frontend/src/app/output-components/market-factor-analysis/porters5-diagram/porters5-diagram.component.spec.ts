import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Porters5DiagramComponent } from './porters5-diagram.component';

describe('Porters5DiagramComponent', () => {
  let component: Porters5DiagramComponent;
  let fixture: ComponentFixture<Porters5DiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Porters5DiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Porters5DiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryOutputComponent } from './secondary-output.component';

describe('SecondaryOutputComponent', () => {
  let component: SecondaryOutputComponent;
  let fixture: ComponentFixture<SecondaryOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

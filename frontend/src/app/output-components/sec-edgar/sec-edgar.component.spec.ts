import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecEdgarComponent } from './sec-edgar.component';

describe('SecEdgarComponent', () => {
  let component: SecEdgarComponent;
  let fixture: ComponentFixture<SecEdgarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecEdgarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecEdgarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

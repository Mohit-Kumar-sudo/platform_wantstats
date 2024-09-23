import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiKeyTakeawaysComponent } from './mi-key-takeaways.component';

describe('MiKeyTakeawaysComponent', () => {
  let component: MiKeyTakeawaysComponent;
  let fixture: ComponentFixture<MiKeyTakeawaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiKeyTakeawaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiKeyTakeawaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

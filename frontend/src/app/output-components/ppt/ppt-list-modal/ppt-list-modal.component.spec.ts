import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptListModalComponent } from './ppt-list-modal.component';

describe('PptListModalComponent', () => {
  let component: PptListModalComponent;
  let fixture: ComponentFixture<PptListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PptListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

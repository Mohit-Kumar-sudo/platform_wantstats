import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePptModalComponent } from './create-ppt-modal.component';

describe('CreatePptModalComponent', () => {
  let component: CreatePptModalComponent;
  let fixture: ComponentFixture<CreatePptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePptModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiDefinitionComponent } from './mi-definition.component';

describe('MiDefinitionComponent', () => {
  let component: MiDefinitionComponent;
  let fixture: ComponentFixture<MiDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

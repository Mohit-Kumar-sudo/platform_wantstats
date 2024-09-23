import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSearchComponent } from './output-search.component';

describe('OutputSearchComponent', () => {
  let component: OutputSearchComponent;
  let fixture: ComponentFixture<OutputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

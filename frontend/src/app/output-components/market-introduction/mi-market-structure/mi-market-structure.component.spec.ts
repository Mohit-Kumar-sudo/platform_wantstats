import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMarketStructureComponent } from './mi-market-structure.component';

describe('MiMarketStructureComponent', () => {
  let component: MiMarketStructureComponent;
  let fixture: ComponentFixture<MiMarketStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiMarketStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiMarketStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

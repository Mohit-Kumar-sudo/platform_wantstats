import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainOutputComponent } from './supply-chain-output.component';

describe('SupplyChainOutputComponent', () => {
  let component: SupplyChainOutputComponent;
  let fixture: ComponentFixture<SupplyChainOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyChainOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

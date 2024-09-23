import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainOutputDialogComponent } from './supply-chain-output-dialog.component';

describe('SupplyChainOutputDialogComponent', () => {
  let component: SupplyChainOutputDialogComponent;
  let fixture: ComponentFixture<SupplyChainOutputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyChainOutputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainOutputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMarketStudyOfScopeComponent } from './mi-market-study-of-scope.component';

describe('MiMarketStudyOfScopeComponent', () => {
  let component: MiMarketStudyOfScopeComponent;
  let fixture: ComponentFixture<MiMarketStudyOfScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiMarketStudyOfScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiMarketStudyOfScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

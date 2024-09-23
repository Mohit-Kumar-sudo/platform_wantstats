import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFinanceNewsComponent } from './google-finance-news.component';

describe('GoogleFinanceNewsComponent', () => {
  let component: GoogleFinanceNewsComponent;
  let fixture: ComponentFixture<GoogleFinanceNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleFinanceNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleFinanceNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

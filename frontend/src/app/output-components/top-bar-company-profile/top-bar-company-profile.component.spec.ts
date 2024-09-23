import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarCompanyProfileComponent } from './top-bar-company-profile.component';

describe('TopBarCompanyProfileComponent', () => {
  let component: TopBarCompanyProfileComponent;
  let fixture: ComponentFixture<TopBarCompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBarCompanyProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

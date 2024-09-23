import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArchivePageComponent } from './my-archive-page.component';

describe('MyArchivePageComponent', () => {
  let component: MyArchivePageComponent;
  let fixture: ComponentFixture<MyArchivePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyArchivePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArchivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

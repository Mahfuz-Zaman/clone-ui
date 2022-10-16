import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductListBannerComponent } from './add-product-list-banner.component';

describe('AddProductListBannerComponent', () => {
  let component: AddProductListBannerComponent;
  let fixture: ComponentFixture<AddProductListBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductListBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductListBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

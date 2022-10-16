import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListBannerComponent } from './product-list-banner.component';

describe('ProductListBannerComponent', () => {
  let component: ProductListBannerComponent;
  let fixture: ComponentFixture<ProductListBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

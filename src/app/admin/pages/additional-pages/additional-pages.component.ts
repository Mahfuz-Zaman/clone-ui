import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-info',
  templateUrl: './additional-pages.component.html',
  styleUrls: ['./additional-pages.component.scss']
})
export class AdditionalPagesComponent implements OnInit {

  allPages: object[] = [
    {_id: 1, name: 'Why Shop Online At Esquire Electronics', slug: 'why-shop-online-at-esquire-electronics'},
    {_id: 2, name: 'Online Purchase Procedure', slug: 'online-purchase-procedure'},
    {_id: 3, name: 'Online Payment Methods', slug: 'online-payment-methods'},
    {_id: 4, name: 'Online Payment Security', slug: 'online-payment-security'},
    {_id: 5, name: 'Online Partner Websites', slug: 'online-partner-websites'},
    {_id: 6, name: 'EMI Payment Facility', slug: 'emi-payment-facility'},
    {_id: 7, name: 'Shohoj Kisti Facility – Installment Facility', slug: 'shohoj-kisti-facility-installment-facility'},
    // {_id: 8, name: 'IPDC Installment Payment Facility', slug: 'ipdc-installment-payment-facility'},
    {_id: 23, name: 'How to download e-Warranty Document', slug: 'how-to-download-e-warranty-document'},
    {_id: 9, name: 'Contact Us', slug: 'contact-us'},
    {_id: 23, name: 'About Us', slug: 'about-us'},
    {_id: 10, name: 'Contact Service Center', slug: 'contact-service-center'},
    // {_id: 11, name: 'Submit Complaint', slug: 'submit-complaint'},
    {_id: 11, name: 'After Sales Support', slug: 'after-sales-support'},
    {_id: 12, name: 'Warranty Policy', slug: 'warranty-policy'},
    {_id: 13, name: 'Return & Refund Policy', slug: 'return-&-refund-policy'},
    {_id: 14, name: 'Privacy Policy', slug: 'privacy-policy'},
    {_id: 15, name: 'Terms and Conditions', slug: 'terms-and-conditions'},
    // {_id: 16, name: 'Store Locator', slug: 'store-locator'},
    // {_id: 17, name: 'Dealer Locator', slug: 'dealer-locator'},
    {_id: 18, name: 'Sharp Brand Products', slug: 'sharp-brand-products'},
    {_id: 19, name: 'General Brand Products', slug: 'general-brand-products'},
    {_id: 20, name: 'Career at Esquire Electronics', slug: 'career-at-esquire-electronics'},
    {_id: 20, name: 'Warranty Details', slug: 'warranty-details'},
    {_id: 20, name: 'Product Authenticator', slug: 'product-authenticator'},
    {_id: 21, name: 'Work With Us', slug: 'work-with-us'},
    {_id: 22, name: 'FAQ', slug: 'faq'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

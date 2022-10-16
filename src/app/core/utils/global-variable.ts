import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'GADGETEX_TOKEN_' + environment.VERSION,
  loggInSession: 'GADGETEX_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'GADGETEX_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'GADGETEX_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'GADGETEX_USER_0_' + environment.VERSION,
  encryptUserLogin: 'GADGETEX_USER_1_' + environment.VERSION,
  loginAdminRole: 'GADGETEX_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'GADGETEX_USER_CART_' + environment.VERSION,
  otpCheck: 'GADGETEX_USER_OTPCHECK_' + environment.VERSION,
  productFormData: 'GADGETEX_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'GADGETEX_USER_CART_' + environment.VERSION,
  recommendedProduct: 'GADGETEX_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'GADGETEX_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'GADGETEX_COOKIE_TERM' + environment.VERSION,
});

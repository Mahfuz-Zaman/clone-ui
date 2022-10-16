import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {User} from '../interfaces/user';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartService} from './cart.service';
import {ProductService} from './product.service';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import auth = firebase.auth;
import {BulkSmsService} from './bulk-sms.service';
import {StorageService} from './storage.service';
import {FacebookLoginProvider, SocialAuthService} from '@abacritt/angularx-social-login';

const API_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private isUser = false;
  private userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private uiService: UiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private productService: ProductService,
    private afAuth: AngularFireAuth,
    private bulkSmsService: BulkSmsService,
    private storageService: StorageService,
    private socialAuthService: SocialAuthService
  ) {
  }

  /**
   * USER REGISTRATION
   */

  userRegistration(data: User, redirectForm?: string) {
    this.httpClient.post<{ success: boolean; message: string; token: string; expiredIn: number }>
    (API_USER + 'registration', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          // Make User Auth True..
          this.spinner.hide();
          if (res.token) {
            this.onSuccessLogin(res.token, res.expiredIn, redirectForm, true);
          }

          this.bulkSmsService.sendMessageWithSubscribe(
            '88' + data.phoneNo,
            `Dear ${data.fullName}, Welcome to Esquire Electronics. Enjoy authentic home appliances at country’s most trusted electronics store www.esquireelectronicsltd.com. Hotline: 8809610001010.`
          );
        } else {
          this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          this.spinner.hide();
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  userLogin(data: { username: string, password: string }, redirectFrom?: string) {

    this.httpClient.put<{ success: boolean; message: string; token: string; expiredIn: number }>
    (API_USER + 'login', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          // Make User Auth True..
          if (res.token) {
            this.onSuccessLogin(res.token, res.expiredIn, redirectFrom);
          }
        } else {
          this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          this.spinner.hide();
        }

      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  /**
   * ON SUCCESS LOGIN
   */

  private onSuccessLogin(token: string, expiredIn: number, redirectFrom?: string, fromRegistration?: boolean) {
    this.isUser = true;
    this.userStatusListener.next(true);

    // For Token Expired Time..
    const expiredInDuration = expiredIn;
    this.setSessionTimer(expiredInDuration);

    // Save Login Time & Expiration Time & Token to Local Storage..
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
    this.saveUserData(token, expirationDate);

    // Snack bar..
    this.uiService.success('Welcome! Login Success.');
    // Spinner
    this.spinner.hide();

    // SYNC CART ITEM
    this.getCarsItemFromLocal();

    // Navigate with Auth..
    if (redirectFrom) {
      this.router.navigate([redirectFrom]);
    } else {
      this.router.navigate([environment.userBaseUrl]);
    }
  }


  /**
   * FIREBASE LOGIN
   */

  AuthLogin(provider, loginType: string) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        const user: User = {
          fullName: credential.user.displayName,
          username: credential.user.uid,
          password: null,
          phoneNo: credential.user.phoneNumber,
          profileImg: credential.user.phoneNumber,
          isPhoneVerified: false,
          isEmailVerified: false,
          email: credential.user.email,
          hasAccess: true,
          registrationType: loginType,
        };
        this.firebaseLoginWithMongo(user);
      }).catch((error) => {
        console.log(error);
      });
  }

  FacebookAuthWithSocialAuth(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(m => {
        const user: User = {
          fullName: m.name,
          username: m.id,
          password: null,
          phoneNo: null,
          profileImg: m.photoUrl,
          isPhoneVerified: false,
          isEmailVerified: false,
          email: m.email ? m.email : null,
          hasAccess: true,
          registrationType: 'facebook',
        };
        // console.log('user', user);
        this.firebaseLoginWithMongo(user);
      })
      .catch(err => {
        console.log(err);
      });
  }

  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider(), 'facebook');
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider(), 'google');
  }

  firebaseLoginWithMongo(credential: User) {
    this.httpClient.post<{ token: string, expiredIn: number }>(API_USER + 'firebase-login', credential)
      .subscribe(res => {
        const getToken = res.token;
        this.token = getToken;
        // Make User Auth True..
        if (getToken) {
          this.onSuccessLogin(getToken, res.expiredIn);
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        // console.log(error);
      });
  }



  /**
   * User Auto Login
   */
  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.setSessionTimer(expiresIn / 10000);
    }
  }

  /**
   * AUTH SESSION
   * SAVE USER DATA
   * CLEAR USER DATA
   */

  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
    }, duration * 1000);
  }

  protected saveUserData(token: string, expiredDate: Date) {
    const data = {
      token,
      expiredDate
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptUserLogin);

  }

  protected getUserData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);

  }

  protected clearUserData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);

  }


  /**
   * MIDDLEWARE OF AUTH STATUS
   */
  getUserToken() {
    return this.token;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  getUserStatus() {
    return this.isUser;
  }


  /**
   * User Logout
   */
  userLogOut() {
    this.token = null;
    this.isUser = false;
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialAuthService.signOut();
      }
    });
    this.afAuth.signOut();
    this.userStatusListener.next(false);

    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.appBaseUrl]);
  }


  /**
   * CHECK USER PHONE
   */

  checkAndGetUserByPhone(phoneNo: string) {
    return this.httpClient.get<{ data: boolean, message: string }>(API_USER + 'check-user-by-phone/' + phoneNo);
  }

  /**
   * CART SYNC FROM LOCAL
   */
  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            const cartsItems = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            this.uiService.openCartViewDialog(cartsItems);
          }
        });
    }
  }

  /**
   * EDIT PASSWORD
   */
  editPassword(data: any) {
    return this.httpClient.post<{ message: string }>(API_USER + 'edit-password', data);
  }

  updatePassword(data: any) {
    return this.httpClient.post<{ success: boolean; message: string }>(API_USER + 'update-password', data);
  }



}

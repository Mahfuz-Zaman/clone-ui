import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UiService} from './ui.service';
import {Admin} from '../interfaces/admin';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {StorageService} from './storage.service';
import {NgxSpinnerService} from 'ngx-spinner';

const API_URL_ADMIN = environment.apiBaseLink + '/api/admin/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private token: string;
  private isAdmin = false;
  private adminRole: string = null;
  private adminStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private uiService: UiService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) {
  }


  // For New User Registration..
  adminRegistration(adminRegData: Admin) {
    return this.httpClient.post<{ success: boolean; message: string; adminId: string }>
    (API_URL_ADMIN + 'registration', adminRegData);
  }

  // For Login User..
  adminLogin(data: any) {

    this.httpClient.put<{ success: boolean; message: string; token: string; expiredIn: number; role: string }>
    (API_URL_ADMIN + 'login', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          this.adminRole = res.role;
          if (res.token) {
            this.isAdmin = true;
            this.adminStatusListener.next(true);
            // For Token Expired Time..
            const expiredInDuration = res.expiredIn;
            this.setSessionTimer(expiredInDuration);
            // Save Login Time & Expiration Time & Token to Local Storage..
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
            // Store to Local
            this.saveAdminData(res.token, expirationDate, res.role);
            this.spinner.hide();
            // Snack bar..
            this.uiService.success(res.message);
            // Navigate..
            this.router.navigate([environment.adminBaseUrl]);
          }
        } else {
          this.uiService.wrong(res.message);
          this.spinner.hide();
          this.adminStatusListener.next(false);
        }

      }, error => {
        this.spinner.hide();
        this.adminStatusListener.next(false);
        // console.log(error);
      });
  }


  // That will Be Call First on Main App Component For Auto Login..
  autoAdminLoggedIn() {
    const authInformation = this.getAdminData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.adminStatusListener.next(true);
      this.isAdmin = true;
      this.adminRole = authInformation.role;
      this.setSessionTimer(expiresIn / 10000);
    }
  }


  // Admin LogOut..
  adminLogOut() {
    this.token = null;
    this.isAdmin = false;
    this.adminStatusListener.next(false);
    // Clear Token from Storage..
    this.clearAdminData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.adminLoginUrl]);
  }


  // User Update Listener..
  // getUserUpdateListener() {
  //   return this.userUpdated.asObservable();
  // }

  // For Set Time Duration in ms..
  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.adminLogOut();
    }, duration * 1000); // 1s = 1000ms
    // console.log('Setting Time: ' + duration);
  }

// For Save Token on Browser Storage..
  protected saveAdminData(token: string, expiredDate: Date, role: string) {
    const data = {
      token,
      expiredDate,
      role
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptAdminLogin);
  }

  // For Clear Token on Browser Storage..
  protected clearAdminData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
  }

  // Get Admin Data from Browser Storage..
  protected getAdminData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptAdminLogin);
  }

  // For Get Login Token..
  getAdminToken() {
    return this.token;
  }

  getAdminRole() {
    return this.adminRole;
  }

  // For Get Auth status listener to Other..
  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getAdminStatus() {
    return this.isAdmin;
  }

  /**
   * Get Logged In Admin Data
   */

  getAdminShortData() {
    return this.httpClient.get<{ data: Admin }>(API_URL_ADMIN + 'get-logged-in-admin-info');
  }


}

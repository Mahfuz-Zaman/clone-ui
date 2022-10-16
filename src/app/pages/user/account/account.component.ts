import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../../services/user-data.service';
import {User} from '../../../interfaces/user';
import {UserService} from '../../../services/user.service';
import {ReloadService} from '../../../services/reload.service';
import {MatDialog} from '@angular/material/dialog';
import {FileUploadService} from '../../../services/file-upload.service';
import {ImageCropComponent} from './image-crop/image-crop.component';
import {UiService} from '../../../services/ui.service';
import {FileData} from '../../../interfaces/file-data';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: User = null;

  // Image Upload
  imageChangedEvent: any = null;
  staticImage = '/assets/svg/user.svg';
  imgPlaceHolder = '/assets/svg/user.svg';

  pickedImage?: any;
  file: any = null;
  newFileName: string;

  imgBlob: any = null;

  // BREAKPOINTS
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 599px)'])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );



  constructor(
    protected userDataService: UserDataService,
    private userService: UserService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshUser$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getLoggedInUserInfo() {
    const select = 'phoneNo fullName profileImg';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
        if (this.user.profileImg) {
          this.imgPlaceHolder = this.user.profileImg;
        }
      }, error => {
        console.log(error);
      });
  }

  editLoggedInUserData(data: any) {
    this.userDataService.editLoginUserInfo(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshUser$();
      }, error => {
        console.log(error);
      });
  }


  /**
   * ON IMAGE PICK
   */

  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      // this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }


  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '680px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          this.pickedImage = dialogResult.croppedImage;
          this.imgPlaceHolder = this.pickedImage;

          if (this.pickedImage) {
            this.imageUploadOnServer();
          }
        }
      }
    });
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  imageUploadOnServer() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'admins'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.removeImageFiles();
        if (this.user.profileImg) {
          this.removeOldImageFromServer(this.user.profileImg);
        }
        this.editLoggedInUserData({profileImg: res.downloadUrl});
      }, error => {
        console.log(error);
      });
  }

  /**
   * REMOVE IMAGE STORE DATA
   */
  removeOldImageFromServer(imgUrl: string) {
    this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe(res => {
        // console.log(res.message);
      }, error => {
        console.log(error);
      });
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.pickedImage = null;
    this.imgBlob = null;
  }


  onLogout() {
    this.userService.userLogOut();
  }


  onLinkChange() {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        const element = document.getElementById('main-sidebar-container-area');
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }, 150);
      }
    });
  }

}

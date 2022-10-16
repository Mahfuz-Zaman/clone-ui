import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {

  private captchaText: string = '';

  constructor() { }

  setCaptchaText(data: string) {
    this.captchaText = data;
  }

  get captchaTxt() {
    return this.captchaText;
  }

  resetCaptchaText() {
    this.captchaText = '';
  }
}

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {

  constructor(
    @Inject(DOCUMENT) private dom,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  setCanonicalURL(url?: string) {
    const canURL = url === undefined ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    if (isPlatformBrowser(this.platformId)) {
      this.dom.head.appendChild(link);
    }
    link.setAttribute('href', canURL);
  }


}

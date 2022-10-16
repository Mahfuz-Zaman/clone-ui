import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  private languageChanged = new BehaviorSubject('en');

  get languageChanged$() {
    return this.languageChanged;
  }

  setLanguage$(ln: string) {
    this.languageChanged.next(ln);
  }
  constructor() { }
}

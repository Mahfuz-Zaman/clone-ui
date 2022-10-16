import {Injectable} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';

@Injectable({
  providedIn: 'root'
})
export class TextEditorCtrService {

  constructor() {
  }

  get bigProductDescConfig() {
    return {
      editable: true,
      minHeight: '250px',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter/Copy product descriptions...',
      sanitize: false,
      toolbarPosition: 'top',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Open Sans',
      fonts: [
        {class: 'font-primary', name: 'Open Sans'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      toolbarHiddenButtons: [
        [

        ],
        [
          'insertVideo'
        ]
      ]
    } as AngularEditorConfig;
  }


  get shortDescConfig() {
    return {
      editable: true,
      minHeight: '160px',
      enableToolbar: true,
      showToolbar: true,
      sanitize: false,
      toolbarPosition: 'top',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Open Sans',
      fonts: [
        {class: 'font-primary', name: 'Open Sans'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      toolbarHiddenButtons: [
        [
          'subscript',
          'superscript',
          'indent',
          'outdent',
        ],
        [
          'insertImage',
          'insertVideo',
          'insertHorizontalRule',
          'removeFormat',
          'toggleEditorMode'
        ]
      ]
    } as AngularEditorConfig;
  }



}

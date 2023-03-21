import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  EncryptString(strData:string){
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(strData));
  }

  DecryptString(encrypted:string){
    return CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
  }
  
}

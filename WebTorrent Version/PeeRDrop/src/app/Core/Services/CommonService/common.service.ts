import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  downloadBLOB(data:any, fileName:any, mimeType:any) {
    var blob, url:any;
    blob = new Blob([data], {
      type: mimeType
    });
    url = window.URL.createObjectURL(blob);
    this.downloadURL(url, fileName);
    setTimeout(function() {
      return window.URL.revokeObjectURL(url);
    }, 1000);
  };

  downloadURL(data:any, fileName:any) {
    var a:any;
    a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };
}

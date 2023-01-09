import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  
  // observer.next(fileBuffer);
  // observer.complete();

  getchunkedFile(file:any){
    let result = new Observable((observer:any) => {
      try{
        let fileBuffer:Array<any> = [];

        const writableStream = new WritableStream({          
          start(controller) { },
          write(chunk, controller) {
            fileBuffer.push(chunk);
          },
          close() { },
          abort(reason) { },
        });
        
        const stream = file.stream();
        stream.pipeTo(writableStream).then((data:any) => {
          observer.next(fileBuffer);
          observer.complete();
        })
      }
      catch(ex:any){
        observer.next(null);
        observer.complete();
      }
    });

    return result;
  }
}

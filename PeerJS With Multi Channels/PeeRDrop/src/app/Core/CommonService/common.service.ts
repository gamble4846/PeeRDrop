import { EventEmitter, Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getchunkedFile(file: any, options: any) {
    let ErrorEvent: EventEmitter<any> = new EventEmitter();
    let DataEvent: EventEmitter<any> = new EventEmitter();
    let EndEvent: EventEmitter<any> = new EventEmitter();

    if (options === undefined) options = {}
    if (options.type === undefined) options.type = "Text"
    if (options.chunkSize === undefined) options.chunkSize = 128000

    var offset = 0, method = 'readAs' + options.type//, dataUrlPreambleLength = "data:;base64,".length

    var onLoadHandler = (evt:any) => {
      if (evt.target.error !== null) {
        ErrorEvent.emit(evt.target.error)
        return;
      };
      var data = evt.target.result;
      offset += options.chunkSize;
      DataEvent.emit(data);
      if (offset >= file.size) {
        EndEvent.emit('end');
      } else {
        readChunk(offset, options.chunkSize, file);
      }
    }

    var readChunk = (_offset:any, length:any, _file:any) => {
      var r = new FileReader();
      var blob = _file.slice(_offset, length + _offset);
      r.onload = onLoadHandler;
      r.readAsArrayBuffer(blob);
    }

    readChunk(offset, options.chunkSize, file)

    return {
      "ErrorEvent": ErrorEvent,
      "DataEvent": DataEvent,
      "EndEvent": EndEvent
    }
  }


  downloadChunkedFile(chatObj:any, Message:any, CurrentFile:any){
    console.log(Message.index);
    if((Message.index) == 0){
      CurrentFile.chunks = "";
    }
    let CurrentChunk:any = Message.data;
    let newString = CurrentFile.chunks + "," + CurrentChunk;    
    CurrentFile.chunks = newString;
    
    // let chunk = new Uint8Array(Object.values(CurrentChunk));
    // CurrentFile.chunks = new Uint8Array([...CurrentFile.chunks, ...chunk]);
    console.log("CurrentFile.chunks.length", CurrentFile.chunks.length);
    console.log("(CurrentFile.fileObject.size / 64000)", (CurrentFile.fileObject.size / 128000));
    console.log("processed A Chunk")

    if((Message.index + 1) >= (CurrentFile.fileObject.size / 128000)){
      CurrentFile.chunks =  CurrentFile.chunks.substr(1,  CurrentFile.chunks.length);
      let finalArray = CurrentFile.chunks.split(",");
      console.log(finalArray);
      let buffer = new Uint8Array(finalArray).buffer;
      let blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, CurrentFile.fileObject.name);
    }
  }

  encryptString(data:string, key:string){
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  decryptString(data:string, key:string){
    const bytes = CryptoJS.AES.decrypt(data, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

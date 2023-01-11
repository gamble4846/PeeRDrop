import { EventEmitter, Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

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
    if (options.chunkSize === undefined) options.chunkSize = 64000

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


  downloadChunkedFile(chatObj:any, CurrentChunk:any, CurrentFile:any){
    let chunk = new Uint8Array(Object.values(CurrentChunk));
    CurrentFile.chunks.push(chunk);
    if(CurrentFile.chunks.length >= (CurrentFile.fileObject.size / 64000)){
      let buffer = new Uint8Array(CurrentFile.chunks.reduce((acc:any, current:any) => acc.concat(current))).buffer;
      let blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, CurrentFile.fileObject.name);
    }
    console.log(CurrentFile);
    console.log(CurrentFile.chunks);
  }
}

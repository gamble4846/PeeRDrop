import { EventEmitter, Injectable } from '@angular/core';

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
    console.log(CurrentFile.finalChunk.length);
    console.log(Object.values(CurrentChunk));
    console.log(new Uint8Array(Object.values(CurrentChunk)));
    CurrentFile.finalChunk = CurrentFile.finalChunk.concat(new Uint8Array(Object.values(CurrentChunk)));
    console.log(CurrentFile.finalChunk.length);
    if(CurrentFile.finalChunk.length === 1) {
      let blob = new Blob([CurrentFile.finalChunk]);
      let url = URL.createObjectURL(blob);
      console.log(url);
    }
  }
}

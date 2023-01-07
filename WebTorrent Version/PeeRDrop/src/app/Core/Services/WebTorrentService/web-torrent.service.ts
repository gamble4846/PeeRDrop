import { Injectable } from '@angular/core';
import { CommonService } from '../../../Core/Services/CommonService/common.service'
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

declare var WebTorrent: any;

@Injectable({
  providedIn: 'root'
})
export class WebTorrentService {

  public CreatedTorrent:BehaviorSubject <any> = new BehaviorSubject<any>(null);
  public DownloadingStatus:BehaviorSubject <any> = new BehaviorSubject<any>(null);

  constructor(
    private CommonService:CommonService
  ) { }

  getTorrent(magnetURL:string){
    const client = new WebTorrent();
    client.add(magnetURL, { path: 'D:\\New folder' }, (torrent:any) => {
      
      // Got torrent metadata!
      console.log('Client is downloading:', torrent.infoHash)

      torrent.on('download',  (bytes:any) => {
        this.DownloadingStatus.next({
          "bytes": bytes,
          "downloaded": torrent.downloaded,
          "downloadSpeed": torrent.downloadSpeed,
          "progress": torrent.progress
        });
      })

      torrent.on('done',  () => {
        torrent.files.forEach( (file:any) => {
          if(file.done){
            file.getBlob( (err:any, blob:any) => {
              this.CommonService.downloadBLOB(blob, file.name, "");
            })
          }
        })
      })
    })
  }

  createTorrent(files:any){
    const client = new WebTorrent();
    client.seed(files,  (torrent:any) => {
      this.CreatedTorrent.next(torrent);
    })
  }
}

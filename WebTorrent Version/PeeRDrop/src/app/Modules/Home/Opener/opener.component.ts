import { ChangeDetectorRef, Component } from '@angular/core';
import { WebTorrentService } from '../../../Core/Services/WebTorrentService/web-torrent.service'

@Component({
  selector: 'app-opener',
  templateUrl: './opener.component.html',
  styleUrls: ['./opener.component.css']
})
export class OpenerComponent {

  magenetURL:string = "";
  createdMagnetTorrentLink:any = "";
  downloadingStatus:any = {};

  constructor(
    private WebTorrentService:WebTorrentService,
    private ref: ChangeDetectorRef
  ) { 

  }

  ngOnInit(): void {
    this.WebTorrentService.CreatedTorrent.subscribe((torrent:any) => {
      if(torrent){
        this.createdMagnetTorrentLink = torrent.magnetURI;
        this.ref.detectChanges();
      }
    })

    this.WebTorrentService.DownloadingStatus.subscribe((statusData:any) => {
      if(statusData){
        this.downloadingStatus = statusData;
        this.ref.detectChanges();
      }
    })
  }

  DownloadTorrent(){
    this.WebTorrentService.getTorrent(this.magenetURL);
  }

  CreateTorrent(event:any){
    this.WebTorrentService.createTorrent(event.target.files);
  }
}

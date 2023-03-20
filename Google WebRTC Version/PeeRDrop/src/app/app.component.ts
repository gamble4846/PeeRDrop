import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connection:RTCPeerConnection | undefined;
  offerJSON:string = "";
  MessageText:string = "";

  constructor() { }

  ngOnInit(): void {
    this.CreateConnection();
  }

  async CreateConnection(){
    const configuration = {iceServers: [{urls: 'stun:stun1.l.google.com:19302'}]};
    this.connection = new RTCPeerConnection(configuration);
    const constraints = {audio: true, video: true};

    try {
      await this.connection.setLocalDescription(await this.connection.createOffer());
      this.connection!.onicecandidate = (event:RTCPeerConnectionIceEvent) => {
        console.log(event);
      }
      console.log(JSON.stringify(this.connection.localDescription));
    } catch (err) {
      console.error(err);
    }
  }

  async AcceptOffer(){
    console.log(JSON.parse(this.offerJSON));
    await this.connection!.setRemoteDescription(JSON.parse(this.offerJSON));
    console.log(this.connection!.getConfiguration());
  }

  async SendMessage(){
    const dc = this.connection!.createDataChannel("BackChannel");
    dc.send(this.MessageText);
  }
}

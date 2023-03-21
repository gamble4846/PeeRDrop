import { Component } from '@angular/core';
import { CommonService } from './Services/CommonService/common.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
    ]
  }
  peerConnection: RTCPeerConnection = new RTCPeerConnection(this.servers);
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  dataChannel: RTCDataChannel | undefined;

  userOneStreamOBJ: any;
  userTwoStreamOBJ: any;
  offerSdp: any;
  answerSdp: any;

  constructor(public _CS: CommonService) { }

  ngOnInit(): void {
    this.GetLocalStream();
    this.userOneStreamOBJ = document.getElementById('user-1');
    this.userTwoStreamOBJ = document.getElementById('user-2');
    this.offerSdp = document.getElementById('offer-sdp');
    this.answerSdp = document.getElementById('answer-sdp');
  }

  async GetLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    this.remoteStream = new MediaStream()
    this.userOneStreamOBJ.srcObject = this.localStream;
    this.userTwoStreamOBJ.srcObject = this.remoteStream;

    this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection.addTrack(track, this.localStream!);
    });

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        this.remoteStream!.addTrack(track);
      });
    };

    this.dataChannel = this.peerConnection.createDataChannel("myDataChannel");

    // Set up event listeners
    this.dataChannel.onopen = () => {
      console.log("Data channel opened");
      // Send message
      this.dataChannel!.send("Hello, world!");
    };

    this.dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    this.dataChannel.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onopen = (event) => {
        channel.send("Hi back!");
      };
      channel.onmessage = (event) => {
        console.log(event.data);
      };
    };
  }

  async createOffer() {
    this.peerConnection.onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        this.offerSdp.value = this._CS.EncryptString(JSON.stringify(this.peerConnection.localDescription));
      }
    };
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
  }

  async createAnswer() {
    console.log(this._CS.DecryptString(this.offerSdp.value));
    let offer = JSON.parse(this._CS.DecryptString(this.offerSdp.value));
    console.log(offer);
    this.peerConnection.onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
      //Event that fires off when a new answer ICE candidate is created
      if (event.candidate) {
        console.log('Adding answer candidate...:', event.candidate)
        this.answerSdp.value = this._CS.EncryptString(JSON.stringify(this.peerConnection.localDescription));
      }
    };
    await this.peerConnection.setRemoteDescription(offer);
    let answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
  }

  async addAnswer() {
    console.log('Add answer triggerd')
    let answer = JSON.parse(this._CS.DecryptString(this.answerSdp.value))
    console.log('answer:', answer)
    if (!this.peerConnection.currentRemoteDescription) {
      this.peerConnection.setRemoteDescription(answer);
    }
  }

  sendMessage() {
    console.log(this.dataChannel);
    this.dataChannel!.send('Hello, world!');
    console.log(this.dataChannel!.send('Hello, world!'));
  }

}

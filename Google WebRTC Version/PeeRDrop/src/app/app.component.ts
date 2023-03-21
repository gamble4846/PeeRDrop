import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  ngOnInit(): void {

  }

  localConnection: RTCPeerConnection | undefined;
  remoteConnection: RTCPeerConnection | undefined;
  sendChannel: any;
  receiveChannel: any;
  pcConstraint: any;
  dataConstraint: any;

  trace(arg: any) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
  }

  getOtherPc(pc: any) {
    return (pc === this.localConnection) ? this.remoteConnection : this.localConnection;
  }

  getName(pc: any) {
    return (pc === this.localConnection) ? 'localPeerConnection' :
      'remotePeerConnection';
  }

  onAddIceCandidateSuccess() {
    this.trace('AddIceCandidate success.');
  }

  onAddIceCandidateError(error: any) {
    this.trace('Failed to add Ice Candidate: ' + error.toString());
  }

  onIceCandidate(pc: any, event: any) {
    this.getOtherPc(pc)!.addIceCandidate(event.candidate)
      .then(
        () => { this.onAddIceCandidateSuccess(); },
        (err: any) => { this.onAddIceCandidateError(err); }
      );
    this.trace(this.getName(pc) + ' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
  }

  onSendChannelStateChange() {
    var readyState = this.sendChannel.readyState;
    this.trace('Send channel state is: ' + readyState);
  }

  gotDescription1(desc: any) {
    debugger
    this.localConnection!.setLocalDescription(desc);
    this.trace('Offer from localConnection \n' + desc.sdp);
    this.remoteConnection!.setRemoteDescription(desc);
    this.remoteConnection!.createAnswer().then(
      this.gotDescription2,
      this.onCreateSessionDescriptionError
    );
  }

  gotDescription2(desc: any) {
    this.remoteConnection!.setLocalDescription(desc);
    this.trace('Answer from remoteConnection \n' + desc.sdp);
    this.localConnection!.setRemoteDescription(desc);
  }

  createConnection() {
    debugger
    var servers = null;
    this.pcConstraint = null;
    this.dataConstraint = null;

    this.trace('Using SCTP based data channels');

    const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
    this.localConnection = new RTCPeerConnection(configuration);
    this.trace('Created local peer connection object localConnection');

    this.sendChannel = this.localConnection.createDataChannel('sendDataChannel', this.dataConstraint);
    this.trace('Created send data channel');

    this.localConnection.onicecandidate = (e: any) => {
      this.onIceCandidate(this.localConnection, e);
    };
    this.sendChannel.onopen = this.onSendChannelStateChange;
    this.sendChannel.onclose = this.onSendChannelStateChange;

    this.remoteConnection = new RTCPeerConnection(configuration);
    this.trace('Created remote peer connection object remoteConnection');

    this.remoteConnection.onicecandidate = (e: any) => {
      this.onIceCandidate(this.remoteConnection, e);
    };
    this.remoteConnection.ondatachannel = this.receiveChannelCallback;

    this.localConnection.createOffer().then(
      this.gotDescription1,
      this.onCreateSessionDescriptionError
    );
  }

  receiveChannelCallback(event: any) {
    this.trace('Receive Channel Callback');
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = this.onReceiveMessageCallback;
    this.receiveChannel.onopen = this.onReceiveChannelStateChange;
    this.receiveChannel.onclose = this.onReceiveChannelStateChange;
  }

  onCreateSessionDescriptionError(error: any) {
    this.trace('Failed to create session description: ' + error.toString());
  }

  sendData() {
    this.sendChannel.send("LOL");
    this.trace('Sent Data: ' + "lol");
  }

  closeDataChannels() {
    this.trace('Closing data channels');
    this.sendChannel.close();
    this.trace('Closed data channel with label: ' + this.sendChannel.label);
    this.receiveChannel.close();
    this.trace('Closed data channel with label: ' + this.receiveChannel.label);
    this.localConnection!.close();
    this.remoteConnection!.close();
    this.localConnection = undefined;
    this.remoteConnection = undefined;
    this.trace('Closed peer connections');
  }

  onReceiveMessageCallback(event:any) {
    this.trace('Received Message');
  }

  onReceiveChannelStateChange() {
    var readyState = this.receiveChannel.readyState;
    this.trace('Receive channel state is: ' + readyState);
  }

}

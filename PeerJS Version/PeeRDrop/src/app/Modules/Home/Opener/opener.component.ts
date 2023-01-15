import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Core/CommonService/common.service';
import { chatModel, fileModel } from 'src/app/Core/Models/chatModel';
import { messageModel } from 'src/app/Core/Models/messageModel';
import { PeerJsService } from 'src/app/Core/PeerJsService/peer-js.service';

@Component({
  selector: 'app-opener',
  templateUrl: './opener.component.html',
  styleUrls: ['./opener.component.css']
})
export class OpenerComponent {

  ConnectId:any = '';
  CurrentChat:any;
  linkForPeer:string = "";

  constructor(
    private route: ActivatedRoute,
    private PeerJs:PeerJsService,
    private _cs:CommonService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.ConnectId = this.route.snapshot.paramMap.get('ConnectId') || "";
    console.log(this.ConnectId);
    this.CreateNewChat();
  }

  CreateNewChat(){
    this.CurrentChat =  this.PeerJs.createChatObject("CHAT" + Math.random().toString(16).slice(2), "ID" + Math.random().toString(16).slice(2));
    this.CurrentChat = this.PeerJs.initializeChat(this.CurrentChat);

    this.CurrentChat.OnOpen.subscribe((id:any) => {
      this.ChatOpened(id);
    });

    this.CurrentChat.OnConnection.subscribe((c:any) => {
      if(this.CurrentChat.conn){
        console.log("Connected to: " + this.CurrentChat.conn.peer);
      }
    });

    this.CurrentChat.OnDisconnected.subscribe((data:any) => {
      console.log("Disconnected", data, this.CurrentChat);
    });

    this.CurrentChat.OnClose.subscribe((data:any) => {
      console.log("Closed", data, this.CurrentChat);
    });

    this.CurrentChat.OnError.subscribe((data:any) => {
      console.log("Error", data, this.CurrentChat);
    });

    this.CurrentChat.OnData.subscribe((data:any) => {
      this.DataRecieved(data);
    });

    this.CurrentChat.OnCall.subscribe((call: any) => {
      this.HandeleOncall(call, this.CurrentChat);
    })
  }

  CreateLinkForPeer(){
    this.linkForPeer = "http://localhost:4200/Home/" + this.CurrentChat.peer.id;
    console.log(this.linkForPeer);
  }

  ChatOpened(id:any){
    console.log('ID: ' + this.CurrentChat.peer.id);
    this.CreateLinkForPeer();
    if(this.ConnectId){
      this.CurrentChat.connectTo = this.ConnectId;
      this.ConnectToNew();
    }
  }

  DataRecieved(data:any){
    let message:messageModel;
    try{
      message = JSON.parse(data);
      console.log(message);
      if(data){
        message = JSON.parse(data);
        if(message.type == "acceptFileRequest"){
          this.PeerJs.sendFile(this.CurrentChat.files.find((x:any) => x.fileId == message.data.fileId), this.CurrentChat);
        }
        else if(message.type == "File Data"){
          this.HandleFileRecieve(this.CurrentChat, message);
        }
        else if(message.type == "sendFileRequest"){
          this.CurrentChat.files.push({
            fileId:message.data.fileId,
            fileObject:message.data.fileObject,
            chunks: "",
          })
        }
      }
    }
    catch(ex){
      message = {
        type:"Simple Message",
        data: data.toString(),
        sendingTime: null,
      }
    }
     
    this.CurrentChat.chatHistory.push({
      data: message,
      dateTime: new Date(),
      isSender: true,
    });

    this.CurrentChat.chatHistory = [...this.CurrentChat.chatHistory];
    this.ref.detectChanges();
  }

  HandleFileRecieve(chatObj:chatModel, message:any){
    const CurrentFile:any = chatObj.files.find((x:any) => x.fileId == message.fileId);
    this._cs.downloadChunkedFile(chatObj,message,CurrentFile);
  }

  ConnectToNew(){
    this.CurrentChat = this.PeerJs.ConnectToNew(this.CurrentChat);
  }

  sendMessage(){
    let message:messageModel = {
      type: "simplemessage",
      data: this.CurrentChat.currentmessage,
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.CurrentChat, JSON.stringify(message));
    
    this.CurrentChat.chatHistory.push({
      data: message,
      dateTime: new Date(),
      isSender: false,
    })
  }

  sendFileRequest(){
    let fileID = "File" + Math.random().toString(16).slice(2) + this.CurrentChat.peer.id;
    let fileData = {
      fileObject: {
        lastModified : this.CurrentChat.selectedFile.lastModified,
        lastModifiedDate : this.CurrentChat.selectedFile.lastModifiedDate,
        name : this.CurrentChat.selectedFile.name,
        size : this.CurrentChat.selectedFile.size,
        type : this.CurrentChat.selectedFile.type,
        webkitRelativePath : this.CurrentChat.selectedFile.webkitRelativePath
      },
      fileId: fileID,
    }

    let fileDataToSave:fileModel = {
      fileId:fileID,
      fileObject:this.CurrentChat.selectedFile,
      chunks: "",
    }

    this.CurrentChat.files.push(fileDataToSave);

    let message:messageModel = {
      type: "sendFileRequest",
      data: fileData,
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.CurrentChat, JSON.stringify(message));
    
    this.CurrentChat.chatHistory.push({
      data: message,
      dateTime: new Date(),
      isSender: false,
    })
  }

  fileSelected(event:any){
    this.CurrentChat.selectedFile = event.target.files[0];
  }

  AcceptFile(fileId:any){
    let message:messageModel = {
      type: "acceptFileRequest",
      data: {
        fileId: fileId
      },
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.CurrentChat, JSON.stringify(message));
  }

  HandeleOncall(call:any, currentChat:chatModel){
    console.log("HandeleOncall", call, currentChat.name);
    try{
      navigator.mediaDevices.getUserMedia({
        video: true, // set to true to get the video stream
        audio: true // set to true to get the audio stream
      }).then((localStream) => {
        call.answer(localStream);
        console.log(call);
        call.on('stream', (remoteStream:any) => {
          console.log("VideoCall", remoteStream);
          const remoteVideo:any = document.getElementById(currentChat.id + "_Video_peer");
          remoteVideo.srcObject = remoteStream;
        });
      }).catch((error) => {
        console.log(`Error getting user media: ${error}`);
      });
    }
    catch(ex){
      console.log(ex);
    }
  }

  VideoCall() {
    navigator.mediaDevices.getUserMedia({
      video: true, // set to true to get the video stream
      audio: true // set to true to get the audio stream
    }).then((localStream) => {

      let call = this.CurrentChat.peer.call(this.CurrentChat.conn.peer, localStream);
      call.answer(localStream);
      const remoteVideo:any = document.getElementById(this.CurrentChat.id + "_Video_me");
      remoteVideo.srcObject = localStream;
      console.log(call);
      call.on('stream', (remoteStream:any) => {
        console.log("VideoCall", remoteStream);
        const remoteVideo:any = document.getElementById(this.CurrentChat.id + "_Video_peer");
        remoteVideo.srcObject = remoteStream;
      });
    }).catch((error) => {
      console.log(`Error getting user media: ${error}`);
    });
  }
}

import { Component } from '@angular/core';
import { CommonService } from './Core/CommonService/common.service';
import { chatModel, fileModel } from './Core/Models/chatModel';
import { messageModel } from './Core/Models/messageModel';
import { PeerJsService } from './Core/PeerJsService/peer-js.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PeeRDrop';
  ListOfChats:Array<chatModel> = [];
  fileStatus:string = "";

  constructor(
    private PeerJs:PeerJsService,
    private _cs:CommonService
  ) { 

  }

  ngOnInit(): void {

  }

  CreateNewChat(){
    let thisChat:chatModel =  this.PeerJs.createChatObject("CHAT" + Math.random().toString(16).slice(2), "ID" + Math.random().toString(16).slice(2));
    thisChat = this.PeerJs.initializeChat(thisChat);
    this.ListOfChats.push(thisChat);
    this.ChatManipulation(thisChat);
  }

  ChatManipulation(chatObj:chatModel){
    chatObj.OnOpen.subscribe((id:any) => {
      console.log('ID: ' + chatObj.peer.id);
    });

    chatObj.OnConnection.subscribe((c:any) => {
      if(chatObj.conn){
        console.log("Connected to: " + chatObj.conn.peer);
      }
    });

    chatObj.OnData.subscribe((data:any) => {
      let message:messageModel;
      try{
        message = JSON.parse(data);
        if(data){
          message = JSON.parse(data);
          if(message.type == "acceptFileRequest"){
            this.PeerJs.sendFile(chatObj.files.find((x:any) => x.fileId == message.data.fileId), chatObj);
          }
          else if(message.type == "File Data"){
            this.HandleFileRecieve(chatObj, message);
          }
          else if(message.type == "sendFileRequest"){
            chatObj.files.push({
              fileId:message.data.fileId,
              fileObject:message.data.fileObject,
              chunks: []
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
       
      chatObj.chatHistory.push({
        data: message,
        dateTime: new Date(),
        isSender: true,
      });

      chatObj.chatHistory = [...chatObj.chatHistory];
    })

    chatObj.OnDisconnected.subscribe((data:any) => {
      console.log("Disconnected", data, chatObj);
    })

    chatObj.OnClose.subscribe((data:any) => {
      console.log("Closed", data, chatObj);
    })

    chatObj.OnError.subscribe((data:any) => {
      console.log("Error", data, chatObj);
    })
  }

  sendMessage(indexOfChat:number){
    let message:messageModel = {
      type: "simplemessage",
      data: this.ListOfChats[indexOfChat].currentmessage,
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.ListOfChats[indexOfChat], JSON.stringify(message));
    
    this.ListOfChats[indexOfChat].chatHistory.push({
      data: message,
      dateTime: new Date(),
      isSender: false,
    })
  }

  ConnectToNew(indexOfChat:number){
    this.ListOfChats[indexOfChat] = this.PeerJs.ConnectToNew(this.ListOfChats[indexOfChat]);
  }

  sendFileRequest(indexOfChat:number){
    let fileID = "File" + Math.random().toString(16).slice(2) + this.ListOfChats[indexOfChat].peer.id;
    let fileData = {
      fileObject: {
        lastModified : this.ListOfChats[indexOfChat].selectedFile.lastModified,
        lastModifiedDate : this.ListOfChats[indexOfChat].selectedFile.lastModifiedDate,
        name : this.ListOfChats[indexOfChat].selectedFile.name,
        size : this.ListOfChats[indexOfChat].selectedFile.size,
        type : this.ListOfChats[indexOfChat].selectedFile.type,
        webkitRelativePath : this.ListOfChats[indexOfChat].selectedFile.webkitRelativePath
      },
      fileId: fileID,
    }

    let fileDataToSave:fileModel = {
      fileId:fileID,
      fileObject:this.ListOfChats[indexOfChat].selectedFile,
      chunks: []
    }

    this.ListOfChats[indexOfChat].files.push(fileDataToSave);

    let message:messageModel = {
      type: "sendFileRequest",
      data: fileData,
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.ListOfChats[indexOfChat], JSON.stringify(message));
    
    this.ListOfChats[indexOfChat].chatHistory.push({
      data: message,
      dateTime: new Date(),
      isSender: false,
    })

    // this.fileStatus = "Reading file";
    // this._cs.getchunkedFile(this.ListOfChats[indexOfChat].selectedFile).subscribe((response:any) => {
    //   console.log(response);
    //   this.fileStatus = "Reading Completed";
    // })
  }

  fileSelected(event:any, indexOfChat:number){
    this.ListOfChats[indexOfChat].selectedFile = event.target.files[0];
  }

  AcceptFile(fileId:any, indexOfChat:number){
    let message:messageModel = {
      type: "acceptFileRequest",
      data: {
        fileId: fileId
      },
      sendingTime: new Date(),
    }

    this.PeerJs.sendData(this.ListOfChats[indexOfChat], JSON.stringify(message));
  }

  HandleFileRecieve(chatObj:chatModel, message:any){
    const CurrentFile:any = chatObj.files.find((x:any) => x.fileId == message.fileId);
    console.log(message);
    // CurrentFile.chunks.push(message);

    // if(CurrentFile.chunks.length >= (CurrentFile.fileObject.size / 64000)){
    //   CurrentFile.chunks.sort((a:any,b:any) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0));
      
    //   console.log(CurrentFile.chunks);

    //   let length = 0;
    //   // myArrays.forEach(item => {
    //   //   length += item.length;
    //   // });
    // }

    // CurrentFile.chunks.concat(new Uint8Array(response.data));
  }
}

import { Component } from '@angular/core';
import { CommonService } from './Core/CommonService/common.service';
import { chatModel } from './Core/Models/chatModel';
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

  sendFile(indexOfChat:number){
    this.fileStatus = "Reading file";
    this._cs.getchunkedFile(this.ListOfChats[indexOfChat].selectedFile).subscribe((response:any) => {
      console.log(response);
      this.fileStatus = "Reading Completed";
    })
  }

  fileSelected(event:any, indexOfChat:number){
    this.ListOfChats[indexOfChat].selectedFile = event.target.files[0];
  }
}

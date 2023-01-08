import { Component } from '@angular/core';
import { chatModel } from './Core/Models/chatModel';
import { PeerJsService } from './Core/PeerJsService/peer-js.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PeeRDrop';
  ListOfChats:Array<chatModel> = [];

  constructor(
    private PeerJs:PeerJsService
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
      chatObj.chatHistory.push({
        data: data,
        dateTime: new Date(),
        isSender: true,
      })
    })

    chatObj.OnDisconnected.subscribe((data:any) => {
      console.log("Disconnected", data);
    })
  }

  sendMessage(indexOfChat:number){
    this.PeerJs.sendData(this.ListOfChats[indexOfChat], this.ListOfChats[indexOfChat].currentmessage);
    this.ListOfChats[indexOfChat].chatHistory.push({
      data: this.ListOfChats[indexOfChat].currentmessage,
      dateTime: new Date(),
      isSender: false,
    })
  }

  ConnectToNew(indexOfChat:number){
    this.ListOfChats[indexOfChat] = this.PeerJs.ConnectToNew(this.ListOfChats[indexOfChat]);
  }

  Disconnect(indexOfChat:number){
    this.ListOfChats[indexOfChat] = this.PeerJs.Disconnect(this.ListOfChats[indexOfChat]);
  }
}

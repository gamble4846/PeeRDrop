import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatModel } from '../Models/chatModel';
import { CommonService } from '../CommonService/common.service';

declare var Peer: any;

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {

  constructor(
    private _cs: CommonService,
  ) { }

  createChatObject(Name: string, id: string) {
    let chat: chatModel = {
      name: Name,
      id: id,
      peer: null,
      conn: null,
      lastPeerId: null,
      peerId: null,
      OnOpen: new BehaviorSubject<any>(null),
      OnConnection: new BehaviorSubject<any>(null),
      OnDisconnected: new BehaviorSubject<any>(null),
      OnClose: new BehaviorSubject<any>(null),
      OnError: new BehaviorSubject<any>(null),
      OnData: new BehaviorSubject<any>(null),
      OnCall: new BehaviorSubject<any>(null),
      chatHistory: [],
      currentmessage: "",
      connectTo: "",
      selectedFile: null,
      files: [],
      chatPassword: "",
    };

    return chat;
  }

  initializeChat(chat: chatModel) {
    // Create own peer object with connection to shared PeerJS server
    chat.peer = new Peer(null, {
      debug: 2
    });

    chat.peer.on('open', (id: any) => {
      if (chat.peer.id === null) {
        chat.peer.id = chat.lastPeerId;
      } else {
        chat.lastPeerId = chat.peer.id;
      }

      chat.OnOpen.next(id);
    });

    chat.peer.on('connection',  (c: any) => {
      if (chat.conn && chat.conn.open) {
        c.on('open', function () {
          c.send("Already connected to another client");
          setTimeout(function () { c.close(); }, 500);
        });
        return;
      }

      chat.conn = c;
      chat.OnConnection.next(c);

      chat.conn.on('data',  (data: any) => {
        if(chat.chatPassword){
          chat.OnData.next(this._cs.decryptString(data, chat.chatPassword));
        }
        else{
          chat.OnData.next(data);
        }
      });
    });

    chat.peer.on('disconnected', function () {
      // if(chat.peer){
      //   // Workaround for peer.reconnect deleting previous id
      //   chat.peer.id = chat.lastPeerId;
      //   chat.peer._lastServerId = chat.lastPeerId;
      //   chat.peer.reconnect();
      // }
      chat.OnDisconnected.next(new Date());
    });

    chat.peer.on('close', function () {
      chat.conn = null;
      chat.OnClose.next(new Date());
    });

    chat.peer.on('error', function (err: any) {
      chat.OnError.next(err);
    });

    chat.peer.on('call', function (call: any) {
      chat.OnCall.next(call);
    });

    return chat;
  }

  sendData(chatObject: chatModel, data: any) {
    if(chatObject.chatPassword){
      if (chatObject.conn) {
        chatObject.conn.send(this._cs.encryptString(data, chatObject.chatPassword));
      }
    }
    else{
      if (chatObject.conn) {
        chatObject.conn.send(data);
      }
    }
  }

  ConnectToNew(chatObject: chatModel) {
    // Close old connection
    if (chatObject.conn) {
      chatObject.conn.close();
    }

    // Create connection to destination peer specified in the input field
    chatObject.conn = chatObject.peer.connect(chatObject.connectTo, {
      reliable: false
    });

    chatObject.conn.on('data',  (data: any) => {
      if(chatObject.chatPassword){
        chatObject.OnData.next(this._cs.decryptString(data, chatObject.chatPassword));
      }
      else{
        chatObject.OnData.next(data);
      }
    });

    return chatObject;
  }

  sendFile(file: any, chatObject: chatModel) {
    let fileEvents = this._cs.getchunkedFile(file.fileObject, undefined);
    let count = 0;
    fileEvents.DataEvent.subscribe((data: any) => {
      let toSend: any = {
        index: count,
        data: Array.from(new Uint8Array(data)).join(","),
        fileId: file.fileId,
        fileStatus: "Pending",
        type: "File Data",
      }

      if(chatObject.chatPassword){
        chatObject.conn.send(this._cs.encryptString(JSON.stringify(toSend), chatObject.chatPassword));
      }
      else{
        chatObject.conn.send(JSON.stringify(toSend));
      }
      
      count++;
    })
  }

  getCallObject(chatObject: chatModel, localStream:any){
    return chatObject.peer.call(chatObject.conn.peer, localStream);;
  }
}

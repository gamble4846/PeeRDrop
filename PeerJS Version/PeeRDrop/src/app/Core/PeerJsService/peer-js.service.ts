import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatModel } from '../Models/chatModel';

declare var Peer: any;

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {

  constructor() { }

  createChatObject(Name:string, id:string){
    let chat:chatModel = {
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
      chatHistory: [],
      currentmessage: "",
      connectTo: ""
    };

    return chat;
  }

  initializeChat(chat:chatModel){
    // Create own peer object with connection to shared PeerJS server
    chat.peer = new Peer(null, {
      debug: 2
    });

    chat.peer.on('open',  (id:any) => {
      if (chat.peer.id === null) {
        chat.peer.id = chat.lastPeerId;
      } else {
        chat.lastPeerId = chat.peer.id;
      }

      chat.OnOpen.next(id);
    });

    chat.peer.on('connection', function (c:any) {
      if (chat.conn && chat.conn.open) {
        c.on('open', function() {
          c.send("Already connected to another client");
          setTimeout(function() { c.close(); }, 500);
        });
        return;
      }

      chat.conn = c;
      chat.OnConnection.next(c);

      chat.conn.on('data', function (data:any) {
        chat.OnData.next(data);
      });
    });

    chat.peer.on('disconnected', function () {
      console.log('Connection lost. Please reconnect');

      // Workaround for peer.reconnect deleting previous id
      chat.peer.id = chat.lastPeerId;
      chat.peer._lastServerId = chat.lastPeerId;
      chat.peer.reconnect();

      // chat.OnDisconnected.next(new Date());
    });

    chat.peer.on('close', function() {
      chat.conn = null;
      chat.OnClose.next(null);
    });

    chat.peer.on('error', function (err:any) {
      chat.OnError.next(err);
    });

    return chat;
  }

  sendData(chatObject:chatModel, data:any){
    if(chatObject.conn){
      chatObject.conn.send(data);
    }
  }

  ConnectToNew(chatObject:chatModel){
    // Close old connection
    if (chatObject.conn) {
      chatObject.conn.close();
    }

    // Create connection to destination peer specified in the input field
    chatObject.conn = chatObject.peer.connect(chatObject.connectTo, {
      reliable: true
    });

    chatObject.conn.on('data', function (data:any) {
      chatObject.OnData.next(data);
    });

    return chatObject;
  }

  Disconnect(chatObject:chatModel){
    if (chatObject.conn) {
      chatObject.conn.close();
    }

    chatObject.connectTo = "";

    return chatObject;
  }
}

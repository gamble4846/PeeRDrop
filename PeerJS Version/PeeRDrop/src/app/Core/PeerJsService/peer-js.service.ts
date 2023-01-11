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
      chatHistory: [],
      currentmessage: "",
      connectTo: "",
      selectedFile: null,
      files: []
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

    chat.peer.on('connection', function (c: any) {
      if (chat.conn && chat.conn.open) {
        c.on('open', function () {
          c.send("Already connected to another client");
          setTimeout(function () { c.close(); }, 500);
        });
        return;
      }

      chat.conn = c;
      chat.OnConnection.next(c);

      chat.conn.on('data', function (data: any) {
        chat.OnData.next(data);
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

    return chat;
  }

  sendData(chatObject: chatModel, data: any) {
    if (chatObject.conn) {
      chatObject.conn.send(data);
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

    chatObject.conn.on('data', function (data: any) {
      chatObject.OnData.next(data);
    });

    return chatObject;
  }

  sendFile(file: any, chatObject: chatModel) {
    console.log(file);
    console.log(chatObject);

    // let countChunk = 0;
    // const writableStream = new WritableStream({          
    //   start(controller) { },
    //   write(chunk, controller) {
    //     debugger
    //     let toSend:any = {
    //       index: countChunk,
    //       data: chunk,
    //       fileId: file.fileId,
    //       fileStatus: "Pending"
    //     }

    //     chatObject.conn.send(JSON.stringify(toSend));
    //   },
    //   close() { },
    //   abort(reason) { },
    // });

    // const stream = file.stream();
    // stream.pipeTo(writableStream).then((data:any) => {
    //   chatObject.conn.send(JSON.stringify({
    //     fileId: file.fileId,
    //     fileStatus: "Completed"
    //   }));
    // })

    let fileEvents = this._cs.getchunkedFile(file.fileObject, undefined);
    let count = 0;
    fileEvents.DataEvent.subscribe((data: any) => {
      let toSend: any = {
        index: count,
        data: data,
        fileId: file.fileId,
        fileStatus: "Pending",
        type: "File Data",
      }
      console.log(toSend);
      chatObject.conn.send(JSON.stringify(toSend));
      console.log(count);
      count++;
    })
  }
}

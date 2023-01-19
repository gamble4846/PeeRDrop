import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from 'src/app/Core/CommonService/common.service';
import { chatModel, messageModel } from 'src/app/Core/Models/Models';
import { PeerJsService } from 'src/app/Core/PeerJsService/peer-js.service';

@Component({
  selector: 'app-opener',
  templateUrl: './opener.component.html',
  styleUrls: ['./opener.component.css']
})
export class OpenerComponent {

  Chat: chatModel | null = null;

  constructor(
    private PeerJs: PeerJsService,
    private _cs: CommonService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.CreateNewChat();
  }

  CreateNewChat() {
    this.Chat = this.PeerJs.createChatObject("CHAT" + Math.random().toString(16).slice(2), "ID" + Math.random().toString(16).slice(2));
    this.Chat.messageChannel = this.PeerJs.initializeChannel(this.Chat.messageChannel);
    this.Chat.videoCallChannel = this.PeerJs.initializeChannel(this.Chat.videoCallChannel);
    this.Chat.screenShareChannel = this.PeerJs.initializeChannel(this.Chat.screenShareChannel);
    this.Chat.fileShareChannelOne = this.PeerJs.initializeChannel(this.Chat.fileShareChannelOne);
    this.Chat.fileShareChannelTwo = this.PeerJs.initializeChannel(this.Chat.fileShareChannelTwo);
    this.Chat.fileShareChannelThree = this.PeerJs.initializeChannel(this.Chat.fileShareChannelThree);
    this.Chat.fileShareChannelFour = this.PeerJs.initializeChannel(this.Chat.fileShareChannelFour);
    this.Chat.fileShareChannelFive = this.PeerJs.initializeChannel(this.Chat.fileShareChannelFive);

    this.SubscribeToAllSubjects();
  }

  SubscribeToAllSubjects() {
    //#region MessageChannel
    this.Chat?.messageChannel.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.messageChannel.peer.id);
    });

    this.Chat?.messageChannel.OnConnection.subscribe((data: any) => {
      if (this.Chat?.messageChannel.conn) {
        this.sendAllChannelIds();
        console.log("Connected to: " + this.Chat?.messageChannel.conn.peer);
      }
    });

    this.Chat?.messageChannel.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.messageChannel.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.messageChannel.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.messageChannel.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.messageChannel.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region VideoCallChannel
    this.Chat?.videoCallChannel.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.videoCallChannel.peer.id);
    });

    this.Chat?.videoCallChannel.OnConnection.subscribe((data: any) => {
      if (this.Chat?.videoCallChannel.conn) {
        console.log("Connected to: " + this.Chat?.videoCallChannel.conn.peer);
      }
    });

    this.Chat?.videoCallChannel.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.videoCallChannel.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.videoCallChannel.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.videoCallChannel.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.videoCallChannel.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region ScreenShareChannel
    this.Chat?.screenShareChannel.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.screenShareChannel.peer.id);
    });

    this.Chat?.screenShareChannel.OnConnection.subscribe((data: any) => {
      if (this.Chat?.screenShareChannel.conn) {
        console.log("Connected to: " + this.Chat?.screenShareChannel.conn.peer);
      }
    });

    this.Chat?.screenShareChannel.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.screenShareChannel.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.screenShareChannel.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.screenShareChannel.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.screenShareChannel.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion
  
    //#region FileShareChannelOne
    this.Chat?.fileShareChannelOne.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.fileShareChannelOne.peer.id);
    });

    this.Chat?.fileShareChannelOne.OnConnection.subscribe((data: any) => {
      if (this.Chat?.fileShareChannelOne.conn) {
        console.log("Connected to: " + this.Chat?.fileShareChannelOne.conn.peer);
      }
    });

    this.Chat?.fileShareChannelOne.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.fileShareChannelOne.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.fileShareChannelOne.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.fileShareChannelOne.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.fileShareChannelOne.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region FileShareChannelTwo
    this.Chat?.fileShareChannelTwo.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.fileShareChannelTwo.peer.id);
    });

    this.Chat?.fileShareChannelTwo.OnConnection.subscribe((data: any) => {
      if (this.Chat?.fileShareChannelTwo.conn) {
        console.log("Connected to: " + this.Chat?.fileShareChannelTwo.conn.peer);
      }
    });

    this.Chat?.fileShareChannelTwo.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.fileShareChannelTwo.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.fileShareChannelTwo.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.fileShareChannelTwo.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.fileShareChannelTwo.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region fileShareChannelThree
    this.Chat?.fileShareChannelThree.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.fileShareChannelThree.peer.id);
    });

    this.Chat?.fileShareChannelThree.OnConnection.subscribe((data: any) => {
      if (this.Chat?.fileShareChannelThree.conn) {
        console.log("Connected to: " + this.Chat?.fileShareChannelThree.conn.peer);
      }
    });

    this.Chat?.fileShareChannelThree.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.fileShareChannelThree.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.fileShareChannelThree.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.fileShareChannelThree.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.fileShareChannelThree.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region fileShareChannelFour
    this.Chat?.fileShareChannelFour.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.fileShareChannelFour.peer.id);
    });

    this.Chat?.fileShareChannelFour.OnConnection.subscribe((data: any) => {
      if (this.Chat?.fileShareChannelFour.conn) {
        console.log("Connected to: " + this.Chat?.fileShareChannelFour.conn.peer);
      }
    });

    this.Chat?.fileShareChannelFour.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.fileShareChannelFour.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.fileShareChannelFour.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.fileShareChannelFour.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.fileShareChannelFour.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion

    //#region fileShareChannelFive
    this.Chat?.fileShareChannelFive.OnOpen.subscribe((id: any) => {
      console.log('ID: ' + this.Chat?.fileShareChannelFive.peer.id);
    });

    this.Chat?.fileShareChannelFive.OnConnection.subscribe((data: any) => {
      if (this.Chat?.fileShareChannelFive.conn) {
        console.log("Connected to: " + this.Chat?.fileShareChannelFive.conn.peer);
      }
    });

    this.Chat?.fileShareChannelFive.OnData.subscribe((data: any) => {
      console.log("OnData", data);
    })

    this.Chat?.fileShareChannelFive.OnDisconnected.subscribe((data: any) => {
      console.log("Disconnected", data);
    })

    this.Chat?.fileShareChannelFive.OnClose.subscribe((data: any) => {
      console.log("Closed", data);
    })

    this.Chat?.fileShareChannelFive.OnError.subscribe((data: any) => {
      console.log("Error", data);
    })

    this.Chat?.fileShareChannelFive.OnCall.subscribe((call: any) => {
      console.log("call", call);
    })
    //#endregion
  }

  sendAllChannelIds(){
    console.log("here");
    let message:messageModel = {
      type: "simplemessage",
      data: {
        "MessageChannel": this.Chat?.messageChannel.conn.peer,
        "VideoCallChannel": this.Chat?.messageChannel.conn.peer,
        "ScreenShareChannel": this.Chat?.messageChannel.conn.peer,
        "FileShareChannelOne": this.Chat?.messageChannel.conn.peer,
        "FileShareChannelTwo": this.Chat?.messageChannel.conn.peer,
        "fileShareChannelThree": this.Chat?.messageChannel.conn.peer,
        "fileShareChannelFour": this.Chat?.messageChannel.conn.peer,
        "fileShareChannelFive": this.Chat?.messageChannel.conn.peer,
      },
      sendingTime: new Date(),
    }

    console.log(message);

    this.PeerJs.sendData(this.Chat!.messageChannel, JSON.stringify(message));
  }
}

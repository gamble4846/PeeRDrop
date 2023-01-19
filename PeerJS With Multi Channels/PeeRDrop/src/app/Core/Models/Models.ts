import { BehaviorSubject } from "rxjs";

export interface chatModel{
    name: string,
    id: string,
    messageChannel: channelModel,
    videoCallChannel:channelModel,
    screenShareChannel:channelModel,
    fileShareChannelOne:channelModel,
    fileShareChannelTwo:channelModel,
    fileShareChannelThree:channelModel,
    fileShareChannelFour:channelModel,
    fileShareChannelFive:channelModel,
    password: string,
    chatHistory: Array<chatHistoryModel>,
    currentMessage: string,
    selectedFile: null,
    AllFiles: [],
}

export interface channelModel{
    peer: any,
    conn: any, 
    lastPeerId: any,
    OnOpen:BehaviorSubject<any>,
    OnConnection:BehaviorSubject<any>,
    OnDisconnected:BehaviorSubject<any>,
    OnClose:BehaviorSubject<any>,
    OnError:BehaviorSubject<any>,
    OnData:BehaviorSubject<any>,
    OnCall:BehaviorSubject<any>,
}

export interface chatHistoryModel{
    data:messageModel,
    dateTime:Date,
    isSender: boolean,
}

export interface messageModel{
    type:string,
    data:any,
    sendingTime: Date | null,
}
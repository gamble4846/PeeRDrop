import { BehaviorSubject } from "rxjs";
import { messageModel } from "./messageModel";

export interface chatModel{
    name: string,
    id: string,
    peer: any,
    conn: any, 
    lastPeerId: any,
    peerId: any,
    OnOpen:BehaviorSubject<any>,
    OnConnection:BehaviorSubject<any>,
    OnDisconnected:BehaviorSubject<any>,
    OnClose:BehaviorSubject<any>,
    OnError:BehaviorSubject<any>,
    OnData:BehaviorSubject<any>,
    chatHistory: Array<chatHistoryModel>,
    currentmessage: string,
    connectTo: string,
    selectedFile: any,
    files: Array<fileModel>
}

export interface chatHistoryModel{
    data:messageModel,
    dateTime:Date,
    isSender: boolean,
}

export interface fileModel{
    fileId:string,
    fileObject:any
}
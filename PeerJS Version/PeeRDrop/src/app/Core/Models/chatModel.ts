import { BehaviorSubject } from "rxjs";

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
}

export interface chatHistoryModel{
    data:any,
    dateTime:Date,
    isSender: boolean,
}
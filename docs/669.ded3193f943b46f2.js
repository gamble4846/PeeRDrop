"use strict";(self.webpackChunkPeeRDrop=self.webpackChunkPeeRDrop||[]).push([[669],{3669:(M,p,a)=>{a.r(p),a.d(p,{HomeModule:()=>c});var d=a(6895),C=a(9965),e=a(8256),g=a(3095),m=a(384),h=a(433);function f(r,n){if(1&r&&(e.TgZ(0,"span"),e._uU(1),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.hij("Connected To :: ",t.CurrentChat.conn.peer,"")}}function _(r,n){1&r&&(e.TgZ(0,"span"),e._uU(1,"Not Connected"),e.qZA())}function T(r,n){if(1&r&&(e.ynx(0),e.TgZ(1,"td"),e._uU(2),e.qZA(),e.TgZ(3,"td"),e._uU(4),e.qZA(),e.BQk()),2&r){const t=e.oxw(2).$implicit;e.xp6(2),e.Oqu(t.data.data),e.xp6(2),e.Oqu(t.data.sendingTime)}}function O(r,n){if(1&r){const t=e.EpF();e.ynx(0),e.TgZ(1,"td"),e._uU(2),e.TgZ(3,"button",3),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(2).$implicit,u=e.oxw();return e.KtG(u.AcceptFile(o.data.data.fileId))}),e._uU(4,"Accept File"),e.qZA()(),e.TgZ(5,"td"),e._uU(6),e.qZA(),e.BQk()}if(2&r){const t=e.oxw(2).$implicit;e.xp6(2),e.hij("",t.data.data.fileObject.name," "),e.xp6(4),e.Oqu(t.data.sendingTime)}}function b(r,n){if(1&r&&(e.ynx(0),e.YNc(1,T,5,2,"ng-container",1),e.YNc(2,O,7,2,"ng-container",1),e.BQk()),2&r){const t=e.oxw().$implicit;e.xp6(1),e.Q6J("ngIf","simplemessage"==t.data.type),e.xp6(1),e.Q6J("ngIf","sendFileRequest"==t.data.type)}}function Z(r,n){if(1&r&&(e.TgZ(0,"tr",9),e.YNc(1,b,3,2,"ng-container",1),e.qZA()),2&r){const t=n.$implicit;e.Q6J("ngClass",t.isSender?"backgroundRed":"backgroundGreen"),e.xp6(1),e.Q6J("ngIf",t.data)}}class s{constructor(n,t,i,o){this.route=n,this.PeerJs=t,this._cs=i,this.ref=o,this.ConnectId="",this.linkForPeer=""}ngOnInit(){this.ConnectId=this.route.snapshot.paramMap.get("ConnectId")||"",console.log(this.ConnectId),this.CreateNewChat()}CreateNewChat(){this.CurrentChat=this.PeerJs.createChatObject("CHAT"+Math.random().toString(16).slice(2),"ID"+Math.random().toString(16).slice(2)),this.CurrentChat=this.PeerJs.initializeChat(this.CurrentChat),this.CurrentChat.OnOpen.subscribe(n=>{this.ChatOpened(n)}),this.CurrentChat.OnConnection.subscribe(n=>{this.CurrentChat.conn&&console.log("Connected to: "+this.CurrentChat.conn.peer)}),this.CurrentChat.OnDisconnected.subscribe(n=>{console.log("Disconnected",n,this.CurrentChat)}),this.CurrentChat.OnClose.subscribe(n=>{console.log("Closed",n,this.CurrentChat)}),this.CurrentChat.OnError.subscribe(n=>{console.log("Error",n,this.CurrentChat)}),this.CurrentChat.OnData.subscribe(n=>{this.DataRecieved(n)}),this.CurrentChat.OnCall.subscribe(n=>{this.HandeleOncall(n,this.CurrentChat)})}CreateLinkForPeer(){this.linkForPeer="http://localhost:4200/Home/"+this.CurrentChat.peer.id,console.log(this.linkForPeer)}ChatOpened(n){console.log("ID: "+this.CurrentChat.peer.id),this.CreateLinkForPeer(),this.ConnectId&&(this.CurrentChat.connectTo=this.ConnectId,this.ConnectToNew())}DataRecieved(n){let t;try{t=JSON.parse(n),console.log(t),n&&(t=JSON.parse(n),"acceptFileRequest"==t.type?this.PeerJs.sendFile(this.CurrentChat.files.find(i=>i.fileId==t.data.fileId),this.CurrentChat):"File Data"==t.type?this.HandleFileRecieve(this.CurrentChat,t):"sendFileRequest"==t.type&&this.CurrentChat.files.push({fileId:t.data.fileId,fileObject:t.data.fileObject,chunks:""}))}catch{t={type:"Simple Message",data:n.toString(),sendingTime:null}}this.CurrentChat.chatHistory.push({data:t,dateTime:new Date,isSender:!0}),this.CurrentChat.chatHistory=[...this.CurrentChat.chatHistory],this.ref.detectChanges()}HandleFileRecieve(n,t){const i=n.files.find(o=>o.fileId==t.fileId);this._cs.downloadChunkedFile(n,t,i)}ConnectToNew(){this.CurrentChat=this.PeerJs.ConnectToNew(this.CurrentChat)}sendMessage(){let n={type:"simplemessage",data:this.CurrentChat.currentmessage,sendingTime:new Date};this.PeerJs.sendData(this.CurrentChat,JSON.stringify(n)),this.CurrentChat.chatHistory.push({data:n,dateTime:new Date,isSender:!1})}sendFileRequest(){let n="File"+Math.random().toString(16).slice(2)+this.CurrentChat.peer.id,t={fileObject:{lastModified:this.CurrentChat.selectedFile.lastModified,lastModifiedDate:this.CurrentChat.selectedFile.lastModifiedDate,name:this.CurrentChat.selectedFile.name,size:this.CurrentChat.selectedFile.size,type:this.CurrentChat.selectedFile.type,webkitRelativePath:this.CurrentChat.selectedFile.webkitRelativePath},fileId:n};this.CurrentChat.files.push({fileId:n,fileObject:this.CurrentChat.selectedFile,chunks:""});let o={type:"sendFileRequest",data:t,sendingTime:new Date};this.PeerJs.sendData(this.CurrentChat,JSON.stringify(o)),this.CurrentChat.chatHistory.push({data:o,dateTime:new Date,isSender:!1})}fileSelected(n){this.CurrentChat.selectedFile=n.target.files[0]}AcceptFile(n){let t={type:"acceptFileRequest",data:{fileId:n},sendingTime:new Date};this.PeerJs.sendData(this.CurrentChat,JSON.stringify(t))}HandeleOncall(n,t){console.log("HandeleOncall",n,t.name);try{navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then(i=>{n.answer(i),console.log(n),n.on("stream",o=>{console.log("VideoCall",o),document.getElementById(t.id+"_Video").srcObject=o})}).catch(i=>{console.log(`Error getting user media: ${i}`)})}catch(i){console.log(i)}}VideoCall(){navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then(n=>{let t=this.CurrentChat.peer.call(this.CurrentChat.conn.peer,n);t.answer(n),console.log(t),t.on("stream",i=>{console.log("VideoCall",i),document.getElementById(this.CurrentChat.id+"_Video").srcObject=i})}).catch(n=>{console.log(`Error getting user media: ${n}`)})}}s.\u0275fac=function(n){return new(n||s)(e.Y36(C.gz),e.Y36(g.z),e.Y36(m.v),e.Y36(e.sBO))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-opener"]],decls:35,vars:11,consts:[[1,"borderOne","paddingFive"],[4,"ngIf"],["type","text",3,"ngModel","ngModelChange"],[3,"click"],["target","_blank",3,"href"],[1,"messageTable"],[3,"ngClass",4,"ngFor","ngForOf"],["type","file",3,"change"],["width","320","height","240","autoplay","",3,"id"],[3,"ngClass"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0),e._uU(1),e.qZA(),e.TgZ(2,"div",0),e._uU(3),e.qZA(),e.TgZ(4,"div",0),e.YNc(5,f,2,1,"span",1),e.YNc(6,_,2,0,"span",1),e.qZA(),e.TgZ(7,"div",0),e._uU(8," Connect To Someone :: "),e.TgZ(9,"input",2),e.NdJ("ngModelChange",function(o){return t.CurrentChat.connectTo=o}),e.qZA(),e.TgZ(10,"button",3),e.NdJ("click",function(){return t.ConnectToNew()}),e._uU(11,"Connect"),e.qZA()(),e.TgZ(12,"div",0),e._uU(13," Chat Password :: "),e.TgZ(14,"input",2),e.NdJ("ngModelChange",function(o){return t.CurrentChat.chatPassword=o}),e.qZA()(),e.TgZ(15,"div",0),e._uU(16," LinkForPeer :: "),e.TgZ(17,"a",4),e._uU(18),e.qZA()(),e.TgZ(19,"div",0)(20,"table",5),e.YNc(21,Z,2,2,"tr",6),e.qZA()(),e.TgZ(22,"div",0)(23,"input",2),e.NdJ("ngModelChange",function(o){return t.CurrentChat.currentmessage=o}),e.qZA(),e.TgZ(24,"button",3),e.NdJ("click",function(){return t.sendMessage()}),e._uU(25,"Send"),e.qZA()(),e.TgZ(26,"div",0)(27,"input",7),e.NdJ("change",function(o){return t.fileSelected(o)}),e.qZA(),e.TgZ(28,"button",3),e.NdJ("click",function(){return t.sendFileRequest()}),e._uU(29,"Send"),e.qZA()(),e.TgZ(30,"div",0)(31,"button",3),e.NdJ("click",function(){return t.VideoCall()}),e._uU(32,"Video Call"),e.qZA()(),e.TgZ(33,"div"),e._UZ(34,"video",8),e.qZA()),2&n&&(e.xp6(1),e.hij("Name = ",t.CurrentChat.name,""),e.xp6(2),e.hij("ID = ",t.CurrentChat.peer.id,""),e.xp6(2),e.Q6J("ngIf",t.CurrentChat.conn),e.xp6(1),e.Q6J("ngIf",!t.CurrentChat.conn),e.xp6(3),e.Q6J("ngModel",t.CurrentChat.connectTo),e.xp6(5),e.Q6J("ngModel",t.CurrentChat.chatPassword),e.xp6(3),e.Q6J("href",t.linkForPeer,e.LSH),e.xp6(1),e.Oqu(t.linkForPeer),e.xp6(3),e.Q6J("ngForOf",t.CurrentChat.chatHistory),e.xp6(2),e.Q6J("ngModel",t.CurrentChat.currentmessage),e.xp6(11),e.MGl("id","",t.CurrentChat.id,"_Video"))},dependencies:[d.mk,d.sg,d.O5,h.Fj,h.JJ,h.On],styles:[".borderOne[_ngcontent-%COMP%]{border:1px solid black}.paddingFive[_ngcontent-%COMP%]{padding:5px}.backgroundRed[_ngcontent-%COMP%]{background-color:#ff8f8f}.backgroundGreen[_ngcontent-%COMP%]{background-color:#baffba}.messageTable[_ngcontent-%COMP%]{border:1px solid black;margin:5px}.messageTable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border:1px solid black;padding:5px}"]});const F=[{path:"",pathMatch:"full",component:s},{path:":ConnectId",pathMatch:"full",component:s}];class l{}l.\u0275fac=function(n){return new(n||l)},l.\u0275mod=e.oAB({type:l}),l.\u0275inj=e.cJS({imports:[C.Bz.forChild(F),C.Bz]});class c{}c.\u0275fac=function(n){return new(n||c)},c.\u0275mod=e.oAB({type:c}),c.\u0275inj=e.cJS({imports:[d.ez,l,h.u5]})}}]);
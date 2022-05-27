let app = require('express');
let http = require('http').Server(app);
//let io = require('socket.io')(http);
const db = require("../db/db");
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200/']
    }
  });

  io.on('connection', (socket) => {
    console.log("angular here");
   
  
  
   socket.on('set-nickname', (nickname) => {
     console.log(nickname);
     socket.nickname = nickname;
     io.emit('users-changed', {user: nickname, event: 'joined'});    
   });
   
   socket.on('add-message', (message) => {
       console.log("new msg adde");
       console.log(message);
       db.executeSql("INSERT INTO `chat`( `sender`, `receiver`, `message`) VALUES ("+message.sender+","+message.receiver+",'"+message.msg+"')", function(data , err){
         if(err){
             console.log("Error in store.js" ,err);
         }
         else{
           db.executeSql("SELECT * FROM chat ORDER BY createddate DESC LIMIT 1" , function(data1 , err){
             if(err){
                 console.log("Error in store.js" ,err);
             }
             else{
              console.log(data1[0]);
               io.emit('message', {data: data1[0]});  
            //    socket.broadcast.emit('msg-broadcast',data1[0]);
               return data1;
 
             }
           });
            
         }
     });
   });
 });
 
 var port = process.env.PORT || 3000;
  
 http.listen(port, function(){
    console.log('chat listening in http://localhost:' + port);
 });
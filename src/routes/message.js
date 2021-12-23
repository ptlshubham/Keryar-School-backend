const express = require("express");
const router = express.Router();
const db = require("../db/db");
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');





let messages = [];

router.get('/', (req, res) => {
    console.log("hello pusher");
  res.send('all good');
});

router.post('/auth', (req, res) => {
    console.log("hello pusher");
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  
  res.send(auth);
});
router.post("/SendMessage",(req,res,next)=>{
  db.executeSql("INSERT INTO `chat`( `sender`, `receiver`, `message`) VALUES ("+req.body.sender+","+req.body.receiver+",'"+req.body.msg+"')",function(data,err){
    if(err){
      console.log(err);
    }
    else{
      db.executeSql("select * from chat where id="+data.insertId,function(data1,err){
        if(err){
          console.log(err)
        }
        else{
          res.json(data1[0]);
        }
      })
    }
  })
})

router.post("/GetMessage",(req,res,next)=>{
  if(req.body.sender ==1){
      db.executeSql("select c.id , c.sender ,c.receiver,c.message,c.createddate,r.name as sendername ,r.name as receivername from chat c left join users r on c.sender = r.uid where c.sender="+req.body.receiver+" OR c.receiver="+req.body.receiver+" ORDER BY createddate " , function(data , err){
          if(err){
              console.log("Error in store.js" ,err);
          }
          else{
             // console.log(data);
              return res.json(data);
          }
      });
  }
  else{
      console.log("other");
      console.log(req.body)
      db.executeSql("select * from chat WHERE  (sender='"+req.body.sender+"' OR sender="+req.body.receiver+") AND (receiver="+req.body.receiver+" OR receiver='"+req.body.sender+"' ) ORDER BY createddate " , function(data , err){
          if(err){
              console.log("Error in store.js" ,err);
          }
          else{
              console.log(data);
              return res.json(data);
          }
      });
  }
     
})



module.exports = router;
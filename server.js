/*引包*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*创建users数组，存放io对象*/
 users = [];
 //存放chatroom1的成员的昵称
 userList1 = [];
 //存放chatroom2的成员的昵称
 userList2 = [];
/*读取静态文件*/
app.use(express.static("./public"));
/*监听客户端连接*/
io.on("connection",function(socket){

/*监听index.html发来的joining事件(输入昵称之后)*/
    socket.on("joining",function(name,location){
//将登录页面收集到的name（昵称）存储在服务器端
        trueName = name;
    users[name] = socket;
    if(location == "room1")
    {
        userList1.push(name);
    }
    else{
        userList2.push(name);
    }
})
//监听Head并把头像地址保存在服务器端
    socket.on("Head",function(Head){
        trueHead =Head;
    })

//监听joined事件（进入chatroom之后）
    socket.on("joined",function(roomId){
    //存放roomId以识别
     var _roomId = "";
    _roomId = roomId;
     socket.join(_roomId);
     //给每个客户端发送各自的昵称、头像信息以保存在客户端
     socket.emit("yourName",trueName);
     socket.emit("yourHead",trueHead);
     //给在同一房间内（拥有相同roomId）的客户端发送事件joined
    io.to(_roomId).emit("joined",trueName);
    //即时更新自己所在房间的在线人数列表
    if(_roomId == "chatroom1")
    {
        io.to(_roomId).emit("userList",userList1);
    }
    else{
        io.to(_roomId).emit("userList",userList2);
    }
    /*控制台提示用户加入及昵称*/
    console.log("user:"+trueName+" "+"is connected");
    })


    /*监听message事件*/
    socket.on("message",function(message,roomId){
        io.to(roomId).emit("message",message);
    })


    //监听head-in-line事件
socket.on("head-in-line",function(head,roomId){
        io.to(roomId).emit("head-in-line",head);
    })


    /*监听username事件*/
    socket.on("username",function(name,roomId){
        io.to(roomId).emit("username",name);
   })


      /*监听exit事件*/
    socket.on("exit",function(name,roomId){
        if(roomId == "chatroom1")
        {
            var number = userList1.length;
        //从原本所在的在线用户的昵称数组里删除
        for(var i = 0;i<number;i++)
        {
           if(userList1[i]==name)
           {
               userList1.splice(i,1);
               break;
           }
        }
        //即时更新在线用户列表，发送用户退出提示
        io.emit("exit",name);
        io.emit("userList",userList1);
    }
    else{
        var number = userList2.length;
        //从原本所在在线用户的昵称数组里删除
        for(var i = 0;i<number;i++)
        {
           if(userList2[i]==name)
           {
               userList2.splice(i,1);
               break;
           }
        }
        //即时更新在线用户列表，发送用户退出提示
        io.emit("exit",name);
        io.emit("userList",userList2);
    }
        //打印用户退出信息
        console.log(name+" has exited");
    })
})


http.listen(80,"127.0.0.1",function(){
    console.log("running at 127.0.0.1");
});
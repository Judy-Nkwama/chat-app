const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const nodeServer = http.createServer(app);
const io = new Server(nodeServer,  {
    cors: {
      origin: "http://localhost:3000"
    }
  });

app.get("/*", (req, res) => {
    res.send("<div>There's nothing here. Go to <a href='http://localhost:3000'/>the app</div>");
});


io.on("connection", socket => {

    socket.on("set-new-user", userData => {
        
        console.log(`new user : ${userData.username} `);
        socket.username = userData.username,
        
        socket.broadcast.emit("notification",{ 
            isHasJoined : true,
            message : `${userData.username} has joined`,
            userData : userData
        });

        socket.emit("notification", {
            isHasJoined : true,
            message : `Welcome ${userData.username}`,
            userData : userData
        });

    });

    
    socket.on("disconnect", userData => {
        socket.broadcast.emit("notification",  {
            isHasJoined : false,
            message : `${userData.username} has left`,
            userData : userData
        });
    });

    socket.on("new-message", messageObject => {
        io.except(socket.id).emit("new-message", messageObject);
    });

});

const PORT = process.env.PORT || 5000;
nodeServer.listen(PORT, () => console.log(`listening on ${PORT}...`));
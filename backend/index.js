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

    socket.on("set-new-user", async userData => {
        
        console.log(`new user : ${userData.username} `);

        // setting the new socket additional info
        socket.username = userData.username;
        socket.isTyping = userData.isTyping;
        socket.sex = userData.sex;
        socket.isOnline = userData.isOnline;
        socket.avatar = userData.avatar;
        socket.userId = userData.userId;
        //--
        
        socket.broadcast.emit("update-friends", userData );

        socket.broadcast.emit("notification",{ 
            isHasJoined : true,
            message : `${userData.username} has joined`
        });

        socket.emit("notification", {
            isHasJoined : true,
            message : `Welcome ${userData.username}`
        });

        const sockets = await io.fetchSockets();
        const currentUsers = sockets.map(socket => {
            //create an empty user objet
            const user = {};
            //fill it with the socket user info and do this for each connected user(socket)
            user.username = socket.username;
            user.isTyping = socket.isTyping;
            user.sex = socket.sex;
            user.isOnline = socket.isOnline;
            user.avatar = socket.avatar;
            user.userId = socket.userId;
            //return the it for mapping
            return user;
        } );

        socket.emit("set-available-friends", currentUsers );

    });
    
    socket.on("disconnect", () => {
        socket.broadcast.emit("notification",  {
            isHasJoined : false,
            message : `${socket.username} has left`
        });
        io.except(socket.id).emit("update-friends", socket.id );
    });

    socket.on("new-message", messageObject => {
        io.except(socket.id).emit("new-message", messageObject);
    });

});

const PORT = process.env.PORT || 5000;
nodeServer.listen(PORT, () => console.log(`listening on ${PORT}...`));
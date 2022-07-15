const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
//app.use(cors());
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
    
    console.log(`${socket.id} has joined`);

    socket.broadcast.emit("notification",{ 
        type : "success",
        message : `${socket.id} has joined` 
    });

    socket.emit("notification", {
        type : "success",
        notification : `Welcome ${socket.id}`
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("notification",  {
            type : "danger",
            notification : `${socket.id} has left`
        });
    });

    socket.on("new-message", message => {
        console.log(message);
        io.except(socket.id).emit("new-message", message );
    });

});

const PORT = process.env.PORT || 5000;
nodeServer.listen(PORT, () => console.log(`listening on ${PORT}...`));
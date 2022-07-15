import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message, Nav, ChatMember, Notification } from './Components';
import "./App.css";


const App = props => {

    const [ socket, setSocket ] = useState( () => io("http://localhost:5000") );
    
    const sendMessage = () => {
        socket.emit("new-message", `message from ${socket.id}`);
    };

    useEffect( () => {

        socket.on("notification", notification => {
            console.log(notification);
        });
        socket.on("new-message", message => {
            console.log(message);
        });

    }, [socket]);

    return (
        <div className="h-100 border border-danger">

            <div style={{zIndex : 2, borderBottom : "4px solid white"}} className='position-fixed top-0 w-100 h-50px'><Nav /></div>
            <div className='position-absolute top-50px w-75 h-50px border border-success'> 
            
                {/* <Message fromMe={true} />
                <Notification isHasJoined={true}/>
                <Message fromMe={false} />
                <Message fromMe={false} />
                <Notification />
                <Message fromMe={true} />
                <Message fromMe={false} />
                <Message fromMe={true} /> */}
            
            </div>
            <div className='position-fixed top-50px end-0 pt-2 border h-50px w-25 border-success'>
                {/* <ChatMember />
                <ChatMember isMan={true} isOnline={true} isTyping={true} /> */}
            </div>
            <div className='position-fixed bottom-0 h-50px w-100 border border-primary'>
                <form className="h-100 bg-light d-flex p-2">
                    <input style={{ background: "rgb(255, 209, 228)" }} name="message" type="text" className="form-control border-0" id="message-input" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"
                        style={{ color: " rgb(216, 5, 93)" }} className="bi bi-send-fill ms-1 me-2" onClick={sendMessage}
                    >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                    </svg>
                </form>
            </div>

        </div>
    );
};
export default App;
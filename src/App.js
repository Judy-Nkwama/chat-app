import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message, Nav, ChatMember, Notification } from './Components';
import { useSelector, useDispatch} from 'react-redux';
import { addNotification, sendMessage } from './redux/features/chat/chatSlice';

import "./App.css";


const App = props => {

    const [ socket, setSocket ] = useState(() => io("http://localhost:5000"));
    const dispatcher = useDispatch();

    //--

    const notifications = useSelector( state => state.chat.notifications);
    const messages = useSelector( state => state.chat.messages);
    const conversationContents = useSelector( state => state.chat.conversationContents)

    //--

    //--

    console.log("App rendered");
    console.log(notifications);
    console.log(messages);
    console.log()

    //--

    const handleSendMessage = event => {
        
        const [ messageInput ] = event.target;
        const messageDetails = {
            message : messageInput.value ,
            senderId : socket.id
        };
        socket.emit("new-message", messageDetails);
        dispatcher(sendMessage(messageDetails));
        messageInput.value = ""
    };

    useEffect( () => {

        socket.on("notification", notification => {
            dispatcher(addNotification(notification));
        });

        socket.on("new-message", messageDetails => {
            dispatcher(sendMessage(messageDetails));
        });

    }, [socket]);

    return (
        <div className="h-100 border border-danger">

            <div style={{zIndex : 2, borderBottom : "4px solid white"}} className='position-fixed top-0 w-100 h-50px'><Nav /></div>
            <div className='position-absolute top-50px w-75 h-50px border border-success'> 
            
                {
                    conversationContents.length > 0 && conversationContents.map( conversationContent => {
                        return conversationContent.type === "notification"
                        ? <Notification key={conversationContent.contentId} message={conversationContent.conversationObject.message} isHasJoined={conversationContent.conversationObject.isHasJoined}/>
                        : <Message key={conversationContent.contentId} fromMe={conversationContent.conversationObject.senderId === socket.id } sender={conversationContent.conversationObject.senderId} message={conversationContent.conversationObject.message} />
                    }) 
                }
                

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
                <form className="h-100 bg-light d-flex p-2" onSubmit={ (event) => { event.preventDefault(); handleSendMessage(event) } }>
                    <input 
                        style={{ background: "rgb(255, 209, 228)" }} name="messageInput" type="text" id="messageInput"
                        className="form-control border-0"
                    />

                    <button type="submit" className="btn btn-outline-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"
                            style={{ color: " rgb(216, 5, 93)" }} className="bi bi-send-fill ms-1 me-2"
                        >
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                        </svg> Send
                    </button>
                </form>
            </div>
            {/* message modal */}
            
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Launch static backdrop modal
            </button>

            
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default App;
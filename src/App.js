import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message, Nav, ChatMember, Notification } from './Components';
import { useSelector, useDispatch} from 'react-redux';
import { addNotification, sendMessage, login } from './redux/features/chat/chatSlice';

import "./App.css";


const App = props => {

    const [ socket, setSocket ] = useState();
    const dispatcher = useDispatch();

    //--

    const me = useSelector( state => state.chat.me);
    const notifications = useSelector( state => state.chat.notifications);
    const messages = useSelector( state => state.chat.messages);
    const conversationContents = useSelector( state => state.chat.conversationContents);

    //--

    //--

    console.log("App rendered");
    console.log(notifications);
    console.log(messages);
    console.log(me.username)
    //--

    const handleLogIn = event => {
        

        const { usernameInput, cancelButton } = event.target;

        if (usernameInput) {

            if (usernameInput.value.length < 2) {
                usernameInput.className = usernameInput.className + " is-invalid";
            } else {
                usernameInput.className =
                    usernameInput.className
                    .split(" ")
                    .filter(item => item != "is-invalid")
                    .join(" ")
                ;

                const socket = io("http://localhost:5000");
                setSocket( socket );
                
                const userData = {
                    "username" : usernameInput.value,
                    "userId" : socket.id,
                    "isOnline" : true,
                    "sex" : "m",
                    "avatar" :`${/*isMan*/true?"m":"w"}${Math.ceil((Math.random() + 0.1) * 4)}.jpg`
                };

                // Tell the other that I just enter
                socket.emit("set-new-user", userData);
                //set myself
                dispatcher(login(userData))

                //empty username field and hide the Modal
                usernameInput.value = "";
                cancelButton.click();
            }
        }
        
        
        
    };

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

        socket?.on("notification", notification => {
            dispatcher(addNotification(notification));
        });

        socket?.on("new-message", messageDetails => {
            dispatcher(sendMessage(messageDetails));
        });

    }, [socket]);

    return (
        <div className="h-100 border border-danger">

            <div style={{zIndex : 2, borderBottom : "4px solid white"}} className='position-fixed top-0 w-100 h-50px'>
                {   
                    me.username
                    ? <Nav userData={me} />
                    : <div className="Nav h-100 text-end p-2" >
                        <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={handleLogIn}> login </button>
                    </div>
                }
            </div>
            <div className='position-absolute top-50px w-75 h-50px border border-success'> 
            
                {
                    conversationContents.length > 0 && conversationContents.map( conversationContent => {
                        return conversationContent.type === "notification"
                        ? <Notification key={conversationContent.contentId} message={conversationContent.conversationObject.message} isHasJoined={conversationContent.conversationObject.isHasJoined}/>
                        : <Message key={conversationContent.contentId} fromMe={conversationContent.conversationObject.senderId === socket.id } sender={conversationContent.conversationObject.senderId} message={conversationContent.conversationObject.message} />
                    }) 
                }

            
            </div>
            <div className='position-fixed top-50px end-0 pt-2 border h-50px w-25 border-success'>
                {/* <ChatMember />
                <ChatMember isMan={true} isOnline={true} isTyping={true} /> */}
            </div>
            <div className='position-fixed bottom-0 h-50px w-100 border border-primary'>
                <form className="h-100 bg-light p-2" onSubmit={ (event) => { event.preventDefault(); handleSendMessage(event) } }>
                    <fieldset disabled={socket ? false : true} className="d-flex h-100">
                        <input 
                            style={{ background: "#dee2ff" }} name="messageInput" type="text" id="messageInput"
                            className="form-control border-0 me-1"
                        />

                        <button type="submit" className="btn btn-sm btn-outline-primary px-2 ms-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="bi bi-send-fill" >
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                            </svg>
                    </button>
                    </ fieldset>
                </form>
            </div>
            {
                /* message modal */
                !socket &&
                <div className="">
                    <form className="modal fade" onSubmit={ event => {
                        event.preventDefault();
                        handleLogIn(event);

                    }} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Log In</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">User name</label>
                                        <input type="text" className="form-control form-control-sm" name="usernameInput" id="username" aria-describedby="username-helper" />
                                        <div className="invalid-feedback">
                                            The username requires at least 2 carracters.
                                        </div>
                                        <div id="username-helper" className="form-text">This name will appear to the othe member as @username</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button name="cancelButton" type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <input type="submit" className="btn btn-sm btn-primary"  value="Log in"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }

        </div>
    );
};
export default App;
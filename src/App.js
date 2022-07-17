import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { io } from 'socket.io-client';
import { Message, Nav, ChatMember, Notification, LoginFormModal } from './Components';
import { addNotification, sendMessage, login, updateFriends, setAvailableFriendsOnLogin } from './redux/features/chat/chatSlice';

import "./App.css";

const App = () => {

    const lastMessageRef = useRef();
    const dispatcher = useDispatch();
    const [ socket, setSocket ] = useState();
    
    //--

    const me = useSelector( state => state.chat.me);
    const notifications = useSelector( state => state.chat.notifications);
    const messages = useSelector( state => state.chat.messages);
    const conversationContents = useSelector( state => state.chat.conversationContents);
    const friends = useSelector( state => state.chat.friends );
 
    //--
    console.log("App rendered");
    console.log(notifications);
    console.log(messages);
    console.log(friends);
    //--

    const handleLogIn = event => {

        const { usernameInput, cancelButton, genderRadioBtn } = event.target;

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

                //create a socket for the new user and set it to the use socket set
                const socketCostant = io("http://localhost:5000");
                setSocket( socketCostant );

                //once the server has connected the user
                socketCostant.on("connect", () => {

                    const userData = {
                        "username" : usernameInput.value,
                        "userId" : socketCostant.id,
                        "isTyping" : false,
                        "isOnline" : true,
                        "sex" : genderRadioBtn.value,
                        "avatar" :`${genderRadioBtn.value}${Math.ceil((Math.random() + 0.1) * 4)}.jpg` //returns something like : m4.jpeg
                    };

                    // Tell the other that I just enter
                    socketCostant.emit("set-new-user", userData);
                    //set myself
                    dispatcher(login(userData))

                    //empty username field and hide the Modal
                    usernameInput.value = "";
                    cancelButton.click();

                });
            }
        }  
    };

    const handleSendMessage = event => {
        
        const { messageInput } = event.target;
        const messageDetails = {
            message : messageInput.value ,
            senderId : me.userId,
            senderName : me.username
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

        socket?.on("update-friends", userData =>{
            dispatcher(updateFriends(userData));
        });

        socket?.on("set-available-friends", availableFriends => {
            dispatcher(setAvailableFriendsOnLogin(availableFriends))
        });

    }, [socket]);

    useEffect( () => {
        if( messages.length > 0 ) { 
            lastMessageRef?.current.scrollIntoView({behavior: 'smooth'}); 
        }
    }, [lastMessageRef.current]);

    return (
        <div className="h-100">

            <div style={{zIndex : 2, borderBottom : "4px solid white"}} className='position-fixed top-0 w-100 h-50px'>
                {  
                    //Once there's a user name (me.username ) mean once the socket has been created and has emited the "set-new-use" event along with his data to the server.
                    //The socket is set befor the user triggers the "set-new-uset" event that actually set the user. So, chect if socket is set won't be enough
                    me.username
                    ? <Nav userData={me} typer="No Body" />
                    : <div className="Nav h-100 text-end p-2" >
                        <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={handleLogIn}> login </button>
                    </div>
                }
            </div>

            <div className='position-absolute pt-2 top-50px w-75'> 
                            
                {
                     conversationContents.length > 0 && conversationContents.map( conversationContent => {
                        if(conversationContent.type === "notification"){
                            // If it is a Notification
                            return <Notification key={conversationContent.contentId} message={conversationContent.conversationObject.message} isHasJoined={conversationContent.conversationObject.isHasJoined}/>
                        }else{
                            //If it is a Message
                            const fromMe = conversationContent.conversationObject.senderId == me.userId;
                            const sender = conversationContent.conversationObject.senderName;
                            const message = conversationContent.conversationObject.message;
                            
                            return (
                                <Message
                                    key={conversationContent.contentId}
                                    fromMe={fromMe}
                                    sender={sender}
                                    message={message}
                                />
                            );
                        } 
                    })
                    
                }
                {/* The next div handle the scroll. It makes sure the last messageis in the view  */}
                <div style={{ marginBottom : "55px" }}  ref={lastMessageRef} ></div>
            </div>

            <div className='position-fixed top-50px end-0 pt-2 w-25 '>
                {
                    /* <ChatMember />*/
                    friends.map( friend => {
                        if( friend.userId != me.userId ){

                            return(
                                <ChatMember
                                    key={friend.userId}
                                    isMan={friend.sex == "m"} 
                                    isOnline={friend.isOnline} 
                                    isTyping={friend.isTyping} 
                                    avatar={friend.avatar}
                                    username={friend.username}
                                />
                            );

                        }
                    })
                }
            </div>

            <div className='position-fixed bottom-0 h-50px w-100'>
                <form className="h-100 bg-light p-2" onSubmit={ (event) => { event.preventDefault(); handleSendMessage(event) } }>
                    <fieldset disabled={socket ? false : true} className="d-flex h-100">
                        
                        <input 
                            style={{ background: "#dee2ff", width : "85%" }} name="messageInput" type="text" id="messageInput"
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
                // message modal
                me.username ? <span></span> : <LoginFormModal onSubmitHandler={handleLogIn} />
            }

        </div>
    );
};
export default App;








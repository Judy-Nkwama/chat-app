import React from 'react';
import { Message, Nav, ChatMember, Notification, SendingForm } from './Components';
import "./App.css";

const App = props => {
    return (
        <div className="h-100 border border-danger">

            <div style={{zIndex : 2, borderBottom : "4px solid white"}} className='position-fixed top-0 w-100 h-50px'><Nav /></div>
            <div className='position-absolute top-50px w-75 h-50px border border-success'> 
            
                <Message fromMe={true} />
                <Notification isHasJoined={true}/>
                <Message fromMe={false} />
                <Message fromMe={false} />
                <Notification />
                <Message fromMe={true} />
                <Message fromMe={false} />
                <Message fromMe={true} />
            
            </div>
            <div className='position-fixed top-50px end-0 pt-2 border h-50px w-25 border-success'>
                <ChatMember />
                <ChatMember isMan={true} isOnline={true} isTyping={true} />
            </div>
            <div className='position-fixed bottom-0 h-50px w-100 border border-primary'>
                <SendingForm />
            </div>



        </div>
    );
};
export default App;
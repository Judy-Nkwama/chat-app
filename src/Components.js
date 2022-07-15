import React, { useEffect, useState } from 'react';

export const Avatar = ({isOnline, isMan}) => {
    const [ profil, setProfile ] = useState( )
    
    useEffect(()=>{
        setProfile(require(`./assets/${isMan?"m":"w"}${Math.ceil((Math.random() + 0.1) * 4)}.jpg`));
    },[]);
    
    return (
        <div className={`w-35px h-35px ${isOnline ? "online-border" : "offline-border"} rounded-circle overflow-hidden`}>
            {profil && <img src={profil} className="d-block w-100" />}
        </div>
    );
};

export const Nav = () => {
    return (
        <div className="Nav h-100">
            <div className="d-flex pt-2 justify-content-end pe-2">
                <span style={{color : "rgb(216, 5, 93)"}} className="text-end lh-sm me-1 fs-13">Judy<br/>0115244547</span>
                <Avatar isMan={true} isOnline={true}/>
            </div>
            <div className="border istyping d-flex">
                <div style={{width : "18px", height : "18px"}} className="spinner-grow text-light mx-1" role="status">
                    <span className="visually-hidden">is typing...</span>
                </div>
                <span>judy is typing...</span>
            </div>
        </div>
    );
};

export const ChatMember = ({isTyping, isOnline, isMan}) => {
    return (
        <div className="d-flex flex-column align-items-center">
            <Avatar isMan={isMan} isOnline={isOnline}/>
            <div className="d-flex align-items-center ">
                <div style={{width : "15px", height : "15px", display : isTyping ? "" : "none"}} className="spinner-grow text-secondary" role="status">
                    <span className="visually-hidden">is typing...</span>
                </div>
                <span className="fs-13 text-secondary">Judy</span>
            </div>
        </div>
    );
};

export const Notification = ({isHasJoined}) => {
    return (
        <div className={`text-center fs-13 text-white ${isHasJoined ? "notif-success" : "notif-danger" }`} >Noella has join...</div>
    );
};

export const Message = ({ fromMe }) => {

    const containerStyle = { background : fromMe ? "rgb(10, 85, 197)" :  "rgb(1, 1, 87)",  }
    const b2Styte = fromMe ? 
        { 
            background: "rgb(50, 113, 207)",
            borderRight : "3px solid orange"
        } :
        { 
            background: "rgb(20, 37, 133)",
            borderLeft : "3px solid rgb(5, 204, 144)"
        }
    ;

    return (
        <div className={`border p-1 ${fromMe ? " ps-4 text-end " : " pe-4 " }`}>
            <div style={containerStyle} className="fs-13 containerStyle p-1 rounded" >
            <div className='text-truncate text-white fw-bold'>{fromMe ? "You" : "Friend"}</div>
            <div
                style={b2Styte}
                className={`lh-1 fs-15 text-wrap p-1 text-white rounded ${fromMe && " "}`} 
            >Message elmtklemük mezülm zlemü mltülm ...</div>
            </div>
        </div>
    );
};


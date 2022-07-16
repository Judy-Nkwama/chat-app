import React, { useEffect, useState } from 'react';

export const Avatar = ({isOnline, avatar}) => {
    const [ profil, setProfile ] = useState( )
    
    useEffect(()=>{
        setProfile(require(`./assets/${avatar}`));
    },[]);
    
    return (
        <div className={`w-35px h-35px ${isOnline ? "online-border" : "offline-border"} rounded-circle overflow-hidden`}>
            {profil && <img src={profil} className="d-block w-100" />}
        </div>
    );
};

export const LoginFormModal = ({ onSubmitHandler }) => {

    const [ username, setUserName ] = useState("");
    const [ gender, setGender ] = useState("m");

    const handleChanges = event => {
        if(event.target.name == "username") setUserName(event.target.value);
        if(event.target.name == "genderRadioBtn") setGender(event.target.value);
    };

    return (
        <div className="">
            <form className="modal fade" onSubmit={event => {
                event.preventDefault();
                onSubmitHandler(event);

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
                                <input onChange={event => handleChanges(event)} type="text" className="form-control form-control-sm" name="usernameInput" id="username" aria-describedby="username-helper" />
                                <div value={username} className="invalid-feedback">
                                    The username requires at least 2 carracters.
                                </div>
                                <div id="username-helper" className="form-text">This name will appear to the othe member as @username</div>
                            </div>
                            <div className="form-check">
                                <input checked={gender == "m"} onChange={event => handleChanges(event)} className="form-check-input" value="m" type="radio" name="genderRadioBtn" id="man" />
                                <label className="form-check-label" htmlFor="man"> Man </label>
                            </div>
                            <div className="form-check">
                                <input checked={gender == "w"} onChange={event => handleChanges(event)} className="form-check-input" value="w" type="radio" name="genderRadioBtn" id="woman" />
                                <label className="form-check-label" htmlFor="woman"> Woman </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button name="cancelButton" type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <input type="submit" className="btn btn-sm btn-primary" value="Log in" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export const Nav = ({ userData, typer}) => {
    const { username, userId, isOnline, avatar } = userData;
    //console.log("user id : " + username, " / user id : " + userId);
    return (
        <div className="Nav h-100">
            <div className="d-flex pt-2 justify-content-end pe-2">
                <span style={{color : "rgb(216, 5, 93)"}} className="text-end lh-sm me-1 fs-13">{username}<br/>{userId}</span>
                <Avatar isOnline={isOnline} avatar={avatar} />
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

export const Notification = ({isHasJoined, message}) => {
    return (
        <div className={`text-center fs-13 text-white my-1 ${isHasJoined ? "notif-success" : "notif-danger" }`} >{message}</div>
    );
};

const FancyButton = React.forwardRef( (props, ref) => (  <button ref={ref} className="FancyButton">    {props.children}
  </button>
));

export const Message = React.forwardRef( (props, ref ) => {

    const containerStyle = { background : props.fromMe ? "rgb(10, 85, 197)" :  "rgb(1, 1, 87)",  }
    const b2Styte = props.fromMe ? 
        { 
            background: "rgb(50, 113, 207)",
            borderRight : "3px solid orange"
        } :
        { 
            background: "rgb(20, 37, 133)",
            borderLeft : "3px solid rgb(5, 204, 144)"
        }
    ;

        console.log( ref.current ?? "is null")

    return (
        <div ref={ref} className={`border p-1 ${props.fromMe ? " ps-4 text-end " : " pe-4 " }`}>
            <div style={containerStyle} className="fs-13 containerStyle p-1 rounded" >
            <div className='text-truncate text-white fw-bold'>{props.fromMe ? "You" : "@" + props.sender }</div>
            <div
                style={b2Styte}
                className={`lh-1 fs-15 text-wrap p-1 text-white rounded ${props.fromMe && " "}`} 
            >{props.message}</div>
            </div>
        </div>
    );
});


import { createSlice } from "@reduxjs/toolkit";
//me : id = sessionId, name, avatar
//notification : mess, type
//friend : id, name, isOnline, isTyping, isMan, avatar (we fixed it so that it does generate a new one in any render cycle)
//conversationContents : contentId, type ( message | notification ), conversationObject

export const chatSlice = createSlice({
    name : "chat",
    initialState : {
        me : {},
        friends : [],
        messages : [],
        notifications : [],
        conversationContents : [] //This is just merge of notification and message best on their incoming order
    },
    reducers : {

        login : (state, action) => {
            state.me = action.payload;
        },
        
        addNotification : (state, action) => {
            const notification = {
                "isHasJoined" : action.payload.isHasJoined,
                "message" : action.payload.message,
            };

            //Add it to the notifications Array
            state.notifications.push(notification);
            //Add it to the conversation Array too 
            state.conversationContents.push({
                "contentId" : `notificatin-${state.notifications.length + 1}`,
                "type" : "notification",
                "conversationObject" : notification
            });
        },

        sendMessage : ( state, action ) => {
            //Add it to the massages Array
            state.messages.push(action.payload);
            //Add it to the conversation Array too 
            state.conversationContents.push({
                "contentId" : `message-${state.messages.length + 1}`,
                "type" : "message",
                "conversationObject" : action.payload
            });

        },
        
        updateFriends : ( state, action ) => {
            
            //add the new user if joining or make him user offline disconecting
            if( action.payload.userId && !state.friends.find( friend => friend.userId == action.payload.userId ) ){
                state.friends.push(action.payload);
            }else{
                state.friends = state.friends.map( friend => {
                    if(friend.userId == action.payload) friend.isOnline = false;
                    return friend;
                });
            }

        },

        setAvailableFriendsOnLogin : ( state, action ) => {
            state.friends = action.payload;
        }
    }
});


export const { 
    login, addNotification, sendMessage, updateFriends, 
    setAvailableFriendsOnLogin
} = chatSlice.actions;

export default chatSlice.reducer;

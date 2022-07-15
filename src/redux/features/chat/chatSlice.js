import { createSlice } from "@reduxjs/toolkit";
//me : id = sessionId, name, avatar
//friend : id, name, isOnline, isTyping, isMan, avatar (we fixed it so that it does generate a new one in any render cycle)
//f

export const chatSlice = createSlice({
    name : "chat",
    initialState : {
        me : {},
        friends : [],
        messages : [],
        notifications : []
    },
    reducers : {
        login : (state, action) => {
            //state.me.id = 
        }
    }
});
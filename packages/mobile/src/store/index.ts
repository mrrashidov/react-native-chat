import {configureStore} from '@reduxjs/toolkit'
import chatContactsReducer from "./chatModule/contacts";
import chatRoomReducer from "./chatModule/room";

export const store = configureStore({
    reducer: {
        contacts: chatContactsReducer,
        room: chatRoomReducer,
    },
})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;



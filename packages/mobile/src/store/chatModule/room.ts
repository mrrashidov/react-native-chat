import {createSlice} from "@reduxjs/toolkit"
import {fetchRoom} from "./api";

interface ChatItem {
    id: number,
    text: string
    createdAt: string,
    user:{
        id:number,
        name:string,
        avatar:string,
    }
}
interface RoomStateInterface {
    messages: ChatItem[]
    loading: boolean
}

const initialState: RoomStateInterface = {
    messages: [],
    loading: false
};

const chatRoomSlice = createSlice({
    name: "chat_room",
    initialState: initialState,
    reducers: {
        sendMessage(state,action) {
            state.messages.push(action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRoom.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchRoom.fulfilled, (state, action) => {
            state.messages = action.payload
            state.loading = false
        })
        builder.addCase(fetchRoom.rejected, state => {
            state.loading = false
        })
    },
})
export const {sendMessage} = chatRoomSlice.actions
export default chatRoomSlice.reducer


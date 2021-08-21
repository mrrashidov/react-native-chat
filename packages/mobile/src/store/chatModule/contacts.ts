import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {fetchContacts} from "./api";

interface ContactItem {
    id: number,
    unseen: number,
    message: string,
    user: {
        id: number,
        name: string,
        avatar: string,
        status: string,
    }
}

interface ContactsStateInterface {
    contacts: ContactItem[]
    loading: boolean
}


const initialState: ContactsStateInterface = {
    contacts: [],
    loading: false
};

const chatContactsSlice = createSlice({
    name: "chat_contacts",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchContacts.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchContacts.fulfilled, (state, action) => {
            state.contacts = action.payload
            state.loading = false
        })
        builder.addCase(fetchContacts.rejected, state => {
            state.loading = false
        })
    }
})

export default chatContactsSlice.reducer

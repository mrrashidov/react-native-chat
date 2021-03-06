import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

const _http = 'http://192.168.0.27:9000'

export const fetchRoom = createAsyncThunk('room/fetchRoom', async ({userId, roomId}: any) => {
    return await axios.get(`${_http}/chat/${userId}/${roomId}/message`).then(res => res.data);
});

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (userId: number) => {
    return await axios.get(`${_http}/chat/${userId}`).then(res => res.data);
});
export const sendDevice = async (payload: object) => {
	console.log('payload',payload)
    return await axios.post(`${_http}/device`,payload).then(res => res.data);
}

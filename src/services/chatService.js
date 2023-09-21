import axios from 'axios';
import { BASE_URL } from './constants';

export const getChatUsers = () => {
    return axios.get(`${BASE_URL}/chat/users`);
}

export const fetchChatHistoryForUser = (chatRoomId) => {
    return axios.get(`${BASE_URL}/chat/history/${chatRoomId}`);
}

export const fetchChatWindow = () => {
    return axios.get(`${BASE_URL}/chat/rooms`);
}

export const createChatRoom = (chatRoomData) => {
    return axios.post(`${BASE_URL}/chat/create`, chatRoomData);
}

export const deleteChatWindow = (roomId) => {
    return axios.get(`${BASE_URL}/chat/delete/${roomId}`);
}

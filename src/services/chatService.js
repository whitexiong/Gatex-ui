import axios from 'axios';
import { BASE_URL } from './constants';

export const getChatUsers = () => {
    return axios.get(`${BASE_URL}/chat/users`);
}

export const fetchChatHistoryForUser = (userId) => {
    return axios.get(`${BASE_URL}/chat/history/${userId}`);
}

export const fetchChatWindow = (roomId) => {
    return axios.get(`${BASE_URL}/chat/rooms/${roomId}`);
}

export const createChatRoom = (chatRoomData) => {
    return axios.post(`${BASE_URL}/chat/create`, chatRoomData);
}

export const deleteChatWindow = (roomId) => {
    return axios.get(`${BASE_URL}/chat/delete/${roomId}`);
}

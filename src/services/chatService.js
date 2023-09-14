import axios from 'axios';
import { BASE_URL } from './constants';

export const getChatUsers = () => {
    return axios.get(`${BASE_URL}/chat/users`);
}

export const fetchChatHistoryForUser = (userId) => {
    return axios.get(`${BASE_URL}/chat/history/${userId}`);
}

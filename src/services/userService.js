import axios from 'axios';

import { BASE_URL } from './constants';


export const UserLogin = (username, password) => {
    return axios.post(`${BASE_URL}/setting/user/login`, {
        username: username,
        password: password
    });
}

export const UserLogout = () => {
    return axios.post(`${BASE_URL}/setting/user/logout`);
}

export const getList = (data) => {
    return axios.post(`${BASE_URL}/setting/user/list`, data);
}

export const add = (userData) => {
    return axios.post(`${BASE_URL}/setting/user/add`, userData);
}

export const detail = (userId) => {
    return axios.get(`${BASE_URL}/setting/user/detail/${userId}`);
}

export const update = (userId, updatedData) => {
    return axios.post(`${BASE_URL}/setting/user/update/${userId}`, updatedData);
}

export const deletedById = (userId) => {
    return axios.get(`${BASE_URL}/setting/user/delete/${userId}`);
}

export const GetUserMenus = () => {
    return axios.get(`${BASE_URL}/setting/user/menus`);
}

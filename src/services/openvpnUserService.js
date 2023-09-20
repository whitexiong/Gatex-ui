import axios from 'axios';

import { BASE_URL } from './constants';


export const UserLogout = () => {
    return axios.post(`${BASE_URL}/openvpn/user/logout`);
}

export const getList = () => {
    return axios.get(`${BASE_URL}/openvpn/user/list`);
}

export const add = (userData) => {
    return axios.post(`${BASE_URL}/openvpn/user/add`, userData);
}

export const detail = (userId) => {
    return axios.get(`${BASE_URL}/openvpn/user/detail/${userId}`);
}

export const update = (userId, updatedData) => {
    return axios.post(`${BASE_URL}/openvpn/user/update/${userId}`, updatedData);
}

export const deletedById = (userId) => {
    return axios.get(`${BASE_URL}/openvpn/user/delete/${userId}`);
}

export const GetUserMenus = () => {
    return axios.get(`${BASE_URL}/openvpn/user/menus`);
}

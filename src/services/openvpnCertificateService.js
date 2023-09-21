import axios from 'axios';

import { BASE_URL } from './constants';


export const UserLogout = () => {
    return axios.post(`${BASE_URL}/openvpn/certificate/logout`);
}

export const getList = () => {
    return axios.get(`${BASE_URL}/openvpn/certificate/list`);
}

export const add = (userData) => {
    return axios.post(`${BASE_URL}/openvpn/certificate/add`, userData);
}

export const detail = (userId) => {
    return axios.get(`${BASE_URL}/openvpn/certificate/detail/${userId}`);
}

export const update = (userId, updatedData) => {
    return axios.post(`${BASE_URL}/openvpn/certificate/update/${userId}`, updatedData);
}

export const deletedById = (userId) => {
    return axios.get(`${BASE_URL}/openvpn/certificate/delete/${userId}`);
}

export const GetUserMenus = () => {
    return axios.get(`${BASE_URL}/openvpn/certificate/menus`);
}

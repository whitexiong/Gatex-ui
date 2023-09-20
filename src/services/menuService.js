import axios from 'axios';

import { BASE_URL } from './constants';


export const getList = () => {
    return axios.get(`${BASE_URL}/setting/menu/list`);
}

export const add = (menuData) => {
    return axios.post(`${BASE_URL}/setting/menu/add`, menuData);
}

export const detail = (id) => {
    return axios.get(`${BASE_URL}/setting/menu/detail/${id}`);
}

export const update = (id, menuData) => {
    return axios.post(`${BASE_URL}/setting/menu/update/${id}`, menuData);
}

export const deletedById = (id) => {
    return axios.get(`${BASE_URL}/setting/menu/delete/${id}`);
}

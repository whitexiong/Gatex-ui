import axios from 'axios';
import { BASE_URL } from './constants';

export const getList = (data) => {
    return axios.post(`${BASE_URL}/projects/list`, data);
}

export const add = (projectData) => {
    return axios.post(`${BASE_URL}/projects/add`, projectData);
}

export const detail = (projectId) => {
    return axios.get(`${BASE_URL}/projects/details/${projectId}`);
}

export const update = (projectId, updatedData) => {
    return axios.post(`${BASE_URL}/projects/update/${projectId}`, updatedData);
}

export const deletedById = (projectId) => {
    return axios.get(`${BASE_URL}/projects/delete/${projectId}`);
}

export const getSetting = (projectId) => {
    return axios.get(`${BASE_URL}/projects/setting/${projectId}`);
}

export const saveSetting = (projectId, updatedData) => {
    return axios.post(`${BASE_URL}/projects/setting/${projectId}`, updatedData);
}

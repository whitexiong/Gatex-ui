import axios from "axios";
import {BASE_URL} from "@/services/constants";

export const getList = (projectId, data) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/list`, data);
}

export const add = (projectId, endpointData) => {
    return axios.post(`${BASE_URL}/projects/${projectId}/api-endpoints/create`, endpointData);
}

export const detail = (projectId, endpointId) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/details/${endpointId}`);
}

export const update = (projectId, endpointId, updatedData) => {
    return axios.post(`${BASE_URL}/projects/${projectId}/api-endpoints/update/${endpointId}`, updatedData);
}

export const deletedById = (projectId, endpointId) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/delete/${endpointId}`);
}

export const initApi = (projectId) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/init`);
}

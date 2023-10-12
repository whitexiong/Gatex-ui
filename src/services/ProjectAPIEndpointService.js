import axios from "axios";
import {BASE_URL} from "@/services/constants";

export const ListProjectAPIEndpoints = (projectId, data) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/list`, data);
}

export const CreateProjectAPIEndpoint = (projectId, endpointData) => {
    return axios.post(`${BASE_URL}/projects/${projectId}/api-endpoints/create`, endpointData);
}

export const GetProjectAPIEndpointDetails = (projectId, endpointId) => {
    return axios.get(`${BASE_URL}/projects/${projectId}/api-endpoints/details/${endpointId}`);
}

export const UpdateProjectAPIEndpoint = (projectId, endpointId, updatedData) => {
    return axios.put(`${BASE_URL}/projects/${projectId}/api-endpoints/update/${endpointId}`, updatedData);
}

export const DeleteProjectAPIEndpoint = (projectId, endpointId) => {
    return axios.delete(`${BASE_URL}/projects/${projectId}/api-endpoints/delete/${endpointId}`);
}

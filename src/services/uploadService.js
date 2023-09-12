import axios from 'axios';

import { BASE_URL } from './constants';

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer' + localStorage.getItem('token')
        }
    });
};

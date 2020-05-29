import axios from 'axios'

const API_URL = 'http://192.168.1.117:5000/api'


export function fetchScenes() {    
    return axios.get(`${API_URL}/scenes`);
}

export function applyScene(id) {
    console.log("finna call")
    return axios.get(`${API_URL}/scene/${id}`)
}

export function postNewScene(scene) {
    return axios.post(`${API_URL}/scene/create`, scene)
    .then(response => (console.log(response.data)));
}

export function deleteScene(id) {
    return axios.delete(`${API_URL}/scene/${id}`);
}
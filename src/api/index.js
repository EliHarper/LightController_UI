import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL + '/api'


export function applyScene(id) {
    console.log("finna call")
    return axios.get(`${API_URL}/scene/${id}`)
}

export function deleteScene(id) {
    return axios.delete(`${API_URL}/scene/${id}`);
}

export function editScene(scene) {
    return axios.put(`${API_URL}/scene/edit`, scene)
}

export function fetchScenes() {
    console.log(`Calling ${API_URL}/scenes`)
    return axios.get(`${API_URL}/scenes`);
}

export function postNewScene(scene) {
    return axios.post(`${API_URL}/scene/create`, scene);
}
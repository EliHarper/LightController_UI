import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL + '/api'


export function applyScene(id) {
    return axios.get(`${API_URL}/scene/${id}`)
}

export function deleteScene(id) {
    return axios.delete(`${API_URL}/scene/${id}`);
}

export function editScene(scene) {
    return axios.put(`${API_URL}/scene/edit`, scene)
}

export function fetchScenes() {
    return axios.get(`${API_URL}/scenes`);
}

export function lightsOff() {
    console.log('calling /off:')
    return axios.get(`${API_URL}/off`);
}

export function postNewScene(scene) {
    return axios.post(`${API_URL}/scene/create`, scene);
}

export function updateBrightness(newBrightness) {
    console.log('calling /brightness/' + String(newBrightness))
    return axios.get(`${API_URL}/brightness/${newBrightness}`)
}
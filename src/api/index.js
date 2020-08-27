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
    return axios.get(`${API_URL}/off`);
}

export function postNewScene(scene) {
    return axios.post(`${API_URL}/scene/create`, scene);
}

export function updateBrightness(newBrightness) {
    return axios.get(`${API_URL}/brightness/${newBrightness}`)
}

export function putIndices(scenes) {
    console.log('calling /indices/edit:')
    return axios.put(`${API_URL}/indices/edit`, scenes);
}


export function ambilightOn() {
    console.log('calling \'/ambilight/on\'')
    return axios.get(`${API_URL}/ambilight/on`)
}

export function ambilightOff() {
    console.log('calling /ambilight/off.')
    return axios.get(`${API_URL}/ambilight/off`)
}
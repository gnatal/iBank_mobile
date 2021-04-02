import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://accenture-java-desafio.herokuapp.com/',
});

// adicionar endpoin
export default api;

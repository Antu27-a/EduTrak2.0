import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

const register = async (email, password, name, role) => {
    const response = await axios.post(`${API_URL}register`, {
        email,
        contraseña: password,
        nombre: name,
        rol: role
    });
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}login`, {
        email,
        contraseña: password
    });
    return response.data;
};

export default {
    register,
    login
};
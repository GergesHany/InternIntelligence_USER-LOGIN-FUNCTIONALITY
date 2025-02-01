/* eslint-disable no-useless-catch */
import axios from 'axios';
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (userData: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

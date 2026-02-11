import axios from "axios";
import { BASE_HOST } from "./apiClient";

const AuthAPI = axios.create({
  baseURL: BASE_HOST + "/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authService = {
  login: async (credentials) => {
    try {
      const response = await AuthAPI.post("/auth/login", credentials);

      if (response.data?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      const response = await AuthAPI.post("/auth/google-login", { idToken });

      if (response.data?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // register: async (userData) => {
  //     try {
  //         const response = await AuthAPI.post('/auth/candidate/register', userData);

  //         // Store tokens from response
  //         if (response.data?.data?.accessToken) {
  //             localStorage.setItem('accessToken', response.data.data.accessToken);
  //         }

  //         if (response.data?.data?.refreshToken) {
  //             localStorage.setItem('refreshToken', response.data.data.refreshToken);
  //         }

  //         return response.data;
  //     } catch (error) {
  //         // Extract error message from API response
  //         const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
  //         throw new Error(errorMessage);
  //     }
  // },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
};

export default authService;

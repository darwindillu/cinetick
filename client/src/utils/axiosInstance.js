import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens } from './auth';
import baseUrl from './Url';

const axiosInstance = axios.create({
  baseURL: process.env.BASEURL,
});


axiosInstance.interceptors.request.use(

  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(`${baseUrl}api/admin/refresh-token`, { token: refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest); 

      } catch (refreshError) {

        console.error('Refresh token failed', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";
import config from "./config";
import qs from "qs";

const Axios = axios.create(config);

// POST 传参序列化
Axios.interceptors.request.use(
  (config) => {
    if (localStorage.stamp) {
      config.headers.Stamp = localStorage.stamp;
    }
    if (config.headers["Content-Type"] == "multipart/form-data") {
      return config;
    }
    if (config.method === "post") config.data = qs.stringify(config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 返回结果处理
Axios.interceptors.response.use(
  (response) => {
    switch (response.status) {
      case 200: {
        if (response?.data?.code < 0) {
          return { ...response?.data, data: null };
        } else {
          return {
            ...response.data,
          };
        }
      }
      default: {
        return { ...response, data: null };
      }
    }
  },
  (error) => {
    switch (error?.response?.status) {
      case 401: {
        return { data: null };
      }
      default: {
        return { data: null };
      }
    }
  }
);

export default Axios;

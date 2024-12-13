import Axios from "./request";

export class ApiService {
  baseUrl = "";
  constructor(url: string) {
    this.baseUrl = url;
  }

  // 获取列表数据
  get(id?: string | undefined | object, query?: unknown) {
    if (!query) {
      query = id;
      id = undefined;
    }
    return Axios({
      url: this.baseUrl + (id ? `/${id}` : ""),
      method: "get",
      params: query,
    });
  }

  // 新增数据
  post(
    id?: string | undefined | object,
    data?: string | object | undefined,
    headers?: object
  ) {
    if (!data) {
      data = id;
      id = undefined;
    }
    return Axios({
      url: this.baseUrl + (id ? `/${id}` : ""),
      method: "post",
      headers,
      data,
    });
  }

  put(id: string | undefined, data: string | object | undefined) {
    if (!data) {
      data = id;
      id = undefined;
    }
    return Axios({
      url: this.baseUrl + (id ? `/${id}` : ""),
      method: "put",
      data,
    });
  }

  delete(id: string | undefined, data: string | object | undefined) {
    if (!data) {
      data = id;
      id = undefined;
    }
    return Axios({
      url: this.baseUrl + (id ? `/${id}` : ""),
      method: "delete",
      data,
    });
  }

  formData(id: string | undefined, data: string | object | undefined) {
    if (!data) {
      data = id;
      id = undefined;
    }
    return Axios({
      url: this.baseUrl + (id ? `/${id}` : ""),
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  }
}

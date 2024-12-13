/*
 * @FilePath: \dev\src\services\request.js
 * @Version: 2.0
 * @LastEditors: lhl
 * @LastEditTime: 2022-04-24 10:34:57
 * @Description:
 */
import axios from 'axios'
import qs from 'qs'
import config from './config'
import i18n from '@/language/index'
import { useTokenStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import { ErrorPost } from '.'

const Axios = axios.create(config)

// POST 传参序列化
Axios.interceptors.request.use(
    (config) => {
        if (localStorage.stamp) {
            config.headers.Stamp = localStorage.stamp
        }
        if (config.headers['Content-Type'] == 'multipart/form-data') {
            return config
        }
        if (config.method === 'post') config.data = qs.stringify(config.data)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 返回结果处理
Axios.interceptors.response.use(
    (response) => {
        if (response.config.url?.indexOf('/log2file') > -1) {
            return { data: null }
        }

        switch (response.status) {
            case 200: {
                if (response?.data?.code < 0) {
                    ElMessage.error(i18n.global.t(response?.data?.msg))
                    ErrorPost.post({
                        sid: localStorage.token,
                        api: response.config.url,
                        info: JSON.stringify(response)
                    })
                    return { data: null }
                } else {
                    return { data: response?.data?.data ?? {}, msg: response?.data?.msg }
                }
            }
            default: {
                ErrorPost.post({
                    sid: localStorage.token,
                    api: response.config.url,
                    info: JSON.stringify(response)
                })
                return { data: null }
            }
        }
    },
    (error) => {
        if (error.config.url?.indexOf('/log2file') > -1) {
            return { data: null }
        }

        switch (error?.response?.status) {
            case 401: {
                localStorage.removeItem('stamp')
                localStorage.removeItem('token')
                ElMessage.error(i18n.global.t(error?.response?.data?.msg))
                const { token } = useTokenStore()
                token.setToken('', '')
                return { data: null }
            }
            default: {
                ErrorPost.post({
                    sid: localStorage.token,
                    api: error.config.url,
                    info: JSON.stringify(error)
                })
                const message = error?.response?.statusText ?? error?.message
                ElMessage.error(i18n.global.t(message ?? 'Unknown Error'))
                return { data: null }
            }
        }
    }
)

export default Axios

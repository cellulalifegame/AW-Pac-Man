import Axios, { AxiosResponse } from 'axios'
import { message } from 'antd';
// interface Result<T = any> {
//   code: number
//   type: 'success' | 'error' | 'warning'
//   message: string
//   result: T
// }

const envMode = import.meta.env.MODE
const baseURL: any = '/api'

const axios = Axios.create({
    baseURL,
    timeout: 50000,
    withCredentials: true
})
axios.defaults.withCredentials = true

// const responseHandle = {
//   200: () => {}
// }

axios.interceptors.request.use(
    (config) => {
        config.withCredentials = true
        const token = localStorage.getItem('token')
        if (token) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config.headers['token'] = token
        }
        // const token = ''
        // token && (config.headers.Authorization = token)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        const {status, data}: any = response
        if (data.code !== 200 && data.code !== 307 && data.code !== 308 && data.message) {
            message.error(data.message)
        }
        return response.data
    },
    (error) => {
        if (error.response && error.response.data) {
            const code = error.response.status
            const msg = error.response.data.message
            console.error(`Code: ${code}, Message: ${msg}`)
            console.error('[Axios Error]', error.response)
        } else {
            console.error(`${error}`)
        }
        return Promise.reject(error)
    }
)

export default axios
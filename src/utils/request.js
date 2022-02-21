import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = "Bearer " + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // code不为0，为失败
    if (res.code !== 0) {
      const errs = res.errors
      let message = "<ul style='padding-left: 0'>"

      for (const item in errs) {
        for (const item2 in errs[item]) {
          message += "<li>" + errs[item][item2] + "</li>"
        }
      }
      message += "</ul>"

      Notification({
        title: res.message || 'Error',
        message,
        type: 'error',
        duration: 5 * 1000,
        dangerouslyUseHTMLString: true
      })
    } else {
      return res
    }
  },
  error => {
    const err = error.response
    Notification({
      title: err.status,
      message: err.data.message || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

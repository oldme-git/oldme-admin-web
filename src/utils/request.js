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
      config.headers['Authorization'] = getToken()
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
      // 将后端传来的数据进行整理，message当作title,errors当作message
      let title = res.message
      const errs = res.errors
      let message

      if (errs === undefined) {
        // 当后端没有errors时。message正常，title为失败
        message = res.message
        title = "失败"
      } else {
        // 当后端有errors时，是对象时
        if (typeof errs === "object") {
          message = '<ul style=\'padding-left: 0\'>'

          for (const item in errs) {
            for (const item2 in errs[item]) {
              message += "<li>" + errs[item][item2] + "</li>"
            }
          }
          message += "</ul>"
        }
        // 当后端有errors时，是字符串时
        if (typeof errs === "string") {
          message = errs
        }
      }

      Notification({
        title,
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
    let title, message

    if (err === undefined) {
      title = error.message
      message = error.message
    } else {
      title = err.status
      message = err.data.message
    }

    Notification({
      title,
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

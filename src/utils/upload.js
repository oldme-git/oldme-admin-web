import { getToken } from '@/utils/auth'

const baseURL = process.env.VUE_APP_BASE_API // url = base url + request url

// 上传地址
export function url() {
  return baseURL + "/upload/img"
}

// 上传头
export function header() {
  return {
    Authorization: "Bearer " + getToken()
  }
}

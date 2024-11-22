import request from '@/utils/request'

// 获取书籍列表
export function list(params) {
  return request({
    url: "v1/reading",
    method: "get",
    params
  })
}

import request from '@/utils/request'

// 创建书籍
export function create(data) {
  return request({
    url: "/v1/reading/create",
    method: "post",
    data
  })
}

// 修改书籍
export function update(id, data) {
  return request({
    url: "/v1/reading/update/" + id,
    method: "post",
    data
  })
}

// 获取书籍详情
export function details(id) {
  return request({
    url: "/v1/reading/show/" + id,
    method: "get"
  })
}

// 获取书籍列表
export function list(params) {
  return request({
    url: "/v1/reading/list",
    method: "get",
    params
  })
}

// 删除书籍
export function del(id) {
  return request({
    url: "/v1/reading/delete/" + id,
    method: "post"
  })
}

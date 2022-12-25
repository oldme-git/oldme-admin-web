import request from '@/utils/request'

// 创建文章
export function create(data) {
  return request({
    url: "/v1/article/create",
    method: "post",
    data
  })
}

// 修改文章
export function update(id, data) {
  return request({
    url: "/v1/article/update/" + id,
    method: "post",
    data
  })
}

// 获取文章列表
export function list(params) {
  return request({
    url: "/v1/article/list",
    method: "get",
    params
  })
}

// 获取文章详情
export function details(id) {
  return request({
    url: "/v1/article/show/" + id,
    method: "get"
  })
}

// 删除文章
export function del(id) {
  return request({
    url: "/v1/article/delete/" + id,
    method: "post"
  })
}

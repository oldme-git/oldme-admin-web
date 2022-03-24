import request from '@/utils/request'

// 创建文章
export function create(data) {
  return request({
    url: "/article",
    method: "post",
    data
  })
}

// 修改文章
export function update(id, data) {
  return request({
    url: "/article/" + id,
    method: "put",
    data
  })
}

// 获取文章列表
export function list() {
  return request({
    url: "/article",
    method: "get"
  })
}

// 获取文章详情
export function details(id) {
  return request({
    url: "/article/" + id,
    method: "get"
  })
}

// 删除文章
export function del(id) {
  return request({
    url: "/article/" + id,
    method: "delete"
  })
}

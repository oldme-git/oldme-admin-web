import request from '@/utils/request'

// 创建管理员
export function create(data) {
  return request({
    url: "/admin",
    method: "post",
    data
  })
}

// 修改管理员
export function update(id, data) {
  return request({
    url: "/admin/" + id,
    method: "put",
    data
  })
}

// 获取管理员列表
export function list(params) {
  return request({
    url: "/admin",
    method: "get",
    params
  })
}

// 获取管理员详情
export function details(id) {
  return request({
    url: "/admin/" + id,
    method: "get"
  })
}

// 删除管理员
export function del(id) {
  return request({
    url: "/admin/" + id,
    method: "delete"
  })
}

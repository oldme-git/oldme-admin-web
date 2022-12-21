import request from '@/utils/request'

// 创建管理员组
export function create(data) {
  return request({
    url: "/v1/article/group/create",
    method: "post",
    data
  })
}

// 修改管理员组
export function update(id, data) {
  return request({
    url: "/v1/article/group/update/" + id,
    method: "post",
    data
  })
}

// 获取管理员组列表
export function list() {
  return request({
    url: "/v1/article/group/list",
    method: "get"
  })
}

// 获取管理员组详情
export function details(id) {
  return request({
    url: "/v1/article/group/show/" + id,
    method: "get"
  })
}

// 删除管理员组
export function del(id) {
  return request({
    url: "/v1/article/group/delete/" + id,
    method: "post"
  })
}

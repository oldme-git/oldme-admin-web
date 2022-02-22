import request from '@/utils/request'

// 创建管理员组
export function create(data) {
  return request({
    url: "/admin_group",
    method: "post",
    data
  })
}

// 修改管理员组
export function update(id, data) {
  return request({
    url: "/admin_group/" + id,
    method: "put",
    data
  })
}

// 获取管理员组列表
export function list() {
  return request({
    url: "/admin_group",
    method: "get"
  })
}

// 获取管理员组详情
export function details(id) {
  return request({
    url: "/admin_group/" + id,
    method: "get"
  })
}

// 删除管理员组详情
export function del(id) {
  return request({
    url: "/admin_group/" + id,
    method: "delete"
  })
}

// 获取操作列表
export function action() {
  return request({
    url: "/admin_group_action",
    method: "get"
  })
}

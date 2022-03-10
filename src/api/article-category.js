import request from '@/utils/request'

// 创建管理员组
export function create(data) {
  return request({
    url: "/article_category",
    method: "post",
    data
  })
}

// 修改管理员组
export function update(id, data) {
  return request({
    url: "/article_category/" + id,
    method: "put",
    data
  })
}

// 获取管理员组列表
export function list() {
  return request({
    url: "/article_category",
    method: "get"
  })
}

// 获取管理员组详情
export function details(id) {
  return request({
    url: "/article_category/" + id,
    method: "get"
  })
}

// 删除管理员组
export function del(id) {
  return request({
    url: "/article_category/" + id,
    method: "delete"
  })
}

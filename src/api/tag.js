import request from '@/utils/request'

// 创建标签
export function create(data) {
  return request({
    url: "/v1/tag/create",
    method: "post",
    data
  })
}

// 修改标签
export function update(id, data) {
  return request({
    url: "/v1/tag/update/" + id,
    method: "post",
    data
  })
}

// 获取标签详情
export function details(id) {
  return request({
    url: "/v1/tag/show/" + id,
    method: "get"
  })
}

// 获取标签列表
export function list(params) {
  return request({
    url: "/v1/tag/list",
    method: "get",
    params
  })
}

// 删除标签
export function del(id) {
  return request({
    url: "/v1/tag/delete/" + id,
    method: "post"
  })
}

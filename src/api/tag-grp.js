import request from '@/utils/request'

// 创建标签分类
export function create(data) {
  return request({
    url: "/v1/tag/group/create",
    method: "post",
    data
  })
}

// 修改标签分类
export function update(id, data) {
  return request({
    url: "/v1/tag/group/update/" + id,
    method: "post",
    data
  })
}

// 获取标签分类详情
export function details(id) {
  return request({
    url: "/v1/tag/group/show/" + id,
    method: "get"
  })
}

// 获取标签分类列表
export function list(params) {
  return request({
    url: "/v1/tag/group/list",
    method: "get",
    params
  })
}

// 删除标签分类
export function del(id) {
  return request({
    url: "/v1/tag/group/delete/" + id,
    method: "post"
  })
}

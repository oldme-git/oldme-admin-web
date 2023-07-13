import request from '@/utils/request'

// 创建文章回复
export function create(data) {
  return request({
    url: "/v1/reply/create",
    method: "post",
    data
  })
}

// 修改文章回复
export function update(id, data) {
  return request({
    url: "/v1/reply/update/" + id,
    method: "post",
    data
  })
}

// 获取文章回复列表
export function list(params) {
  return request({
    url: "/v1/reply/list",
    method: "get",
    params
  })
}

// 获取文章回复详情
export function details(id) {
  return request({
    url: "/v1/reply/show/" + id,
    method: "get"
  })
}

// 删除文章回复
export function del(id) {
  return request({
    url: "/v1/reply/delete/" + id,
    method: "post"
  })
}

// 审核
export function check(id, data) {
  return request({
    url: "/v1/reply/check/" + id,
    method: "post",
    data
  })
}

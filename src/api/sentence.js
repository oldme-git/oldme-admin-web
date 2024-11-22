import request from '@/utils/request'

// 创建句子
export function create(data) {
  return request({
    url: "/v1/sentence/create",
    method: "post",
    data
  })
}

// 修改句子
export function update(id, data) {
  return request({
    url: "/v1/sentence/update/" + id,
    method: "post",
    data
  })
}

// 获取句子详情
export function details(id) {
  return request({
    url: "/v1/sentence/show/" + id,
    method: "get"
  })
}

// 获取句子列表
export function list(params) {
  return request({
    url: "/v1/sentence/list",
    method: "get",
    params
  })
}

// 删除句子
export function del(id) {
  return request({
    url: "/v1/sentence/delete/" + id,
    method: "post"
  })
}

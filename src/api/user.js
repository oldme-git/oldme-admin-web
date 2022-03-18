import request from "@/utils/request"

// 登录
export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: "/logout",
    method: "DELETE"
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: "/account",
    method: "get"
  })
}

// 修改基本信息
export function update(data) {
  return request({
    url: "/account",
    method: "put",
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: "/account/password",
    method: "put",
    data
  })
}



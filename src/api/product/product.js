import request from '@/utils/request'

export function list() {
  return request({
    url: 'api/product',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/menu',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/menu',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/menu',
    method: 'put',
    data
  })
}

export default { add, edit, del, list }

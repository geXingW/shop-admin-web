import request from '@/utils/request'

export function list() {
  return request({
    url: 'api/order',
    method: 'get'
  })
}

export function info(id){
  return request({
    url: 'api/order/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/order',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/order',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/order',
    method: 'put',
    data
  })
}

export default { add, edit, del, list }

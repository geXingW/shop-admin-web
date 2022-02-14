import request from '@/utils/request'

export function list() {
  return request({
    url: 'api/product',
    method: 'get'
  })
}

export function show(id) {
  return request({
    url: `api/product/${id}`
  })
}

export function add(data) {
  return request({
    url: 'api/product',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/product',
    method: 'delete',
    data: ids
  })
}

export function edit(id, data) {
  return request({
    url: `api/product/${id}`,
    method: 'put',
    data
  })
}

export function changeSaleStatus(id, data) {
  return request({
    url: `api/product/change-sale-status/${id}`,
    method: 'put',
    data
  })
}

export default { add, edit, del, list, changeSaleStatus }

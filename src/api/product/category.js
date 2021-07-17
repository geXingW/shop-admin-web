import request from '@/utils/request'

export function list(params) {
  params = params || {pid : 0}
  return request({
    url: 'api/product/category',
    method: 'get',
    params
  })
}

export function tree() {
  return request({
    url: 'api/product/category/tree',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/product/category',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/product/category',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/product/category',
    method: 'put',
    data
  })
}

export default { add, edit, del, list, tree }

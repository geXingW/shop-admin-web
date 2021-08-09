import request from '@/utils/request'

export function list(params) {
  return request({
    url: 'api/sys/city',
    method: 'get',
    params
  })
}

export function buildTree(params) {
  return request({
    url: 'api/sys/city/build-tree',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sys/city',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/sys/city',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sys/city',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del, list, buildTree }

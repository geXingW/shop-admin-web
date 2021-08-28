import request from '@/utils/request'

export function list(params) {
  params = params || {pid : 0}
  return request({
    url: 'api/product/attribute-group',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/product/attribute-group',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/product/attribute-group',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: `api/product/attribute-group/${data.id}`,
    method: 'put',
    data
  })
}

export default { list, add, edit, del }

import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'api/sys/city',
    method: 'get',
    data
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

export default { add, edit, del, list }

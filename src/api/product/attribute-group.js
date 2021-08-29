import request from '@/utils/request'

export function list(params) {
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

export function getAttachAttributeList(params){
  return request({
    url: 'api/product/attribute-group/attach-attribute',
    method: 'get',
    params
  })
}

export function detachAttributeList(params){
  return request({
    url: 'api/product/attribute-group/detach-attribute',
    method: 'get',
    params
  })
}

export function attachAttributeToGroup(data) {
  return request({
    url: 'api/product/attribute-group/attach-attribute/' + data.groupId,
    method: 'post',
    data
  })
}

export function detachAttributeToGroup(groupId, ids) {
  return request({
    url: 'api/product/attribute-group/attach-attribute/' + groupId,
    method: 'delete',
    data: ids
  })
}


export default { list, add, edit, del, getAttachAttributeList, detachAttributeList, attachAttributeToGroup, detachAttributeToGroup }

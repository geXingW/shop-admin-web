import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'api/admin',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/admin',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  data.jobs = data.jobs.map((item) => { return { id: item.id } })
  data.roles = data.roles.map((item) => { return { id: item.id } })
  data.dept = { id: data.dept.id }
  return request({
    url: 'api/admin',
    method: 'put',
    data
  })
}

export function editUser(data) {
  console.log(data)
  data.jobs = data.jobs.map((item) => { return { id: item.id } })
  data.roles = data.roles.map((item) => { return { id: item.id } })
  data.dept = { id: data.dept.id }
  console.log(data)
  return request({
    url: 'api/admin/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/admin/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/admin/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del }


import api from './api';

const roleService = {
  getAll() {
    return api.get('/roles').then((res) => res.data);
  },
  getById(id) {
    return api.get(`/roles/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/roles', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/roles/${id}`, payload).then((res) => res.data);
  },
};

export default roleService;

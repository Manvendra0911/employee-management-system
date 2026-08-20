import api from './api';

const departmentService = {
  getAll() {
    return api.get('/departments').then((res) => res.data);
  },
  getById(id) {
    return api.get(`/departments/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/departments', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/departments/${id}`, payload).then((res) => res.data);
  },
};

export default departmentService;

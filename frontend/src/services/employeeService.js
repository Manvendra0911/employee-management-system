import api from './api';

/**
 * All employee-related API calls live here. Components never call
 * axios or build URLs directly - they call these functions instead.
 */
const employeeService = {
  getAll({ keyword, departmentId, roleId, status, sortBy, sortDirection } = {}) {
    const params = {};
    if (departmentId) params.departmentId = departmentId;
    if (roleId) params.roleId = roleId;
    if (status) params.status = status;
    if (sortBy) params.sortBy = sortBy;
    if (sortDirection) params.sortDirection = sortDirection;

    if (keyword && keyword.trim()) {
      params.name = keyword.trim();
      return api.get('/employees/search', { params }).then((res) => res.data);
    }
    return api.get('/employees', { params }).then((res) => res.data);
  },

  getById(id) {
    return api.get(`/employees/${id}`).then((res) => res.data);
  },

  create(payload) {
    return api.post('/employees', payload).then((res) => res.data);
  },

  update(id, payload) {
    return api.put(`/employees/${id}`, payload).then((res) => res.data);
  },

  remove(id) {
    return api.delete(`/employees/${id}`);
  },
};

export default employeeService;

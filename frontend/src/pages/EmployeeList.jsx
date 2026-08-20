import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import roleService from '../services/roleService';
import EmployeeTable from '../components/EmployeeTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { LoadingState, EmptyState, ErrorState } from '../components/StateBlocks';
import { useToast } from '../hooks/useToast';
import { IconSearch, IconInbox, IconPlus } from '../components/icons';

export default function EmployeeList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [departmentId, setDepartmentId] = useState(searchParams.get('departmentId') || '');
  const [roleId, setRoleId] = useState(searchParams.get('roleId') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sortBy, setSortBy] = useState('employee_id');
  const [sortDirection, setSortDirection] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    departmentService.getAll().then(setDepartments).catch(() => {});
    roleService.getAll().then(setRoles).catch(() => {});
  }, []);

  const loadEmployees = useCallback(() => {
    setLoading(true);
    setError(null);
    employeeService
      .getAll({
        keyword,
        departmentId: departmentId || undefined,
        roleId: roleId || undefined,
        status: status || undefined,
        sortBy,
        sortDirection,
      })
      .then(setEmployees)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [keyword, departmentId, roleId, status, sortBy, sortDirection]);

  // Debounce search-as-you-type against the backend.
  useEffect(() => {
    const timer = setTimeout(loadEmployees, 350);
    return () => clearTimeout(timer);
  }, [loadEmployees]);

  const handleSortChange = (col, dir) => {
    setSortBy(col);
    setSortDirection(dir);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeService.remove(deleteTarget.employeeId);
      toast.success('Employee deleted successfully.');
      setDeleteTarget(null);
      loadEmployees();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = keyword || departmentId || roleId || status;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Search, filter and manage every employee record.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employees/new')}>
          <IconPlus /> Add Employee
        </button>
      </div>

      <div className="card card-pad" style={{ marginBottom: 0 }}>
        <div className="filter-bar">
          <div className="search-input">
            <IconSearch />
            <input
              type="text"
              placeholder="Search by name, code or email…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select className="select-filter" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>
          <select className="select-filter" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.roleName}
              </option>
            ))}
          </select>
          <select className="select-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loading && <LoadingState rows={6} />}

        {!loading && error && <ErrorState description={error} onRetry={loadEmployees} />}

        {!loading && !error && employees.length === 0 && (
          <EmptyState
            icon={<IconInbox />}
            title={hasFilters ? 'No employees match these filters' : 'No employees yet'}
            description={
              hasFilters
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first employee.'
            }
            action={
              !hasFilters && (
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/employees/new')}>
                  + Add Employee
                </button>
              )
            }
          />
        )}

        {!loading && !error && employees.length > 0 && (
          <EmployeeTable
            employees={employees}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            onDeleteRequest={setDeleteTarget}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this employee?"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.fullName} (${deleteTarget.employeeCode})? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

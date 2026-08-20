import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import roleService from '../services/roleService';
import { useToast } from '../hooks/useToast';
import { IconArrowLeft } from '../components/icons';
import { LoadingState, ErrorState } from '../components/StateBlocks';

const EMPTY_FORM = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  salary: '',
  joiningDate: '',
  departmentId: '',
  roleId: '',
  status: 'ACTIVE',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([departmentService.getAll(), roleService.getAll()])
      .then(([deps, rls]) => {
        setDepartments(deps);
        setRoles(rls);
      })
      .catch(() => toast.error('Could not load departments/roles.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    employeeService
      .getById(id)
      .then((emp) => {
        setForm({
          employeeCode: emp.employeeCode,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          salary: emp.salary,
          joiningDate: emp.joiningDate,
          departmentId: String(emp.departmentId),
          roleId: String(emp.roleId),
          status: emp.status,
        });
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const validateClientSide = () => {
    const next = {};
    if (!form.employeeCode.trim()) next.employeeCode = 'Employee code is required';
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.salary) next.salary = 'Salary is required';
    else if (Number(form.salary) <= 0) next.salary = 'Salary must be greater than 0';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required';
    if (!form.departmentId) next.departmentId = 'Department is required';
    if (!form.roleId) next.roleId = 'Role is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateClientSide()) return;

    setSubmitting(true);
    const payload = {
      ...form,
      salary: Number(form.salary),
      departmentId: Number(form.departmentId),
      roleId: Number(form.roleId),
    };

    try {
      if (isEdit) {
        await employeeService.update(id, payload);
        toast.success('Employee updated successfully.');
      } else {
        await employeeService.create(payload);
        toast.success('Employee created successfully.');
      }
      navigate('/employees');
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
        toast.error('Please fix the highlighted fields.');
      } else {
        toast.error(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <BackLink />
        <div className="card card-pad">
          <LoadingState rows={6} />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <BackLink />
        <div className="card card-pad">
          <ErrorState description={loadError} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the employee record below.' : 'Fill in the details to create a new employee record.'}
          </p>
        </div>
      </div>

      <form className="card card-pad" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field label="Employee Code" required error={errors.employeeCode}>
            <input
              value={form.employeeCode}
              onChange={handleChange('employeeCode')}
              placeholder="EMP-1016"
              className={errors.employeeCode ? 'has-error' : ''}
            />
          </Field>

          <Field label="Status" required error={errors.status}>
            <select value={form.status} onChange={handleChange('status')}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </Field>

          <Field label="First Name" required error={errors.firstName}>
            <input
              value={form.firstName}
              onChange={handleChange('firstName')}
              placeholder="Asha"
              className={errors.firstName ? 'has-error' : ''}
            />
          </Field>

          <Field label="Last Name" required error={errors.lastName}>
            <input
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Rao"
              className={errors.lastName ? 'has-error' : ''}
            />
          </Field>

          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="asha.rao@example.com"
              className={errors.email ? 'has-error' : ''}
            />
          </Field>

          <Field label="Phone" required error={errors.phone}>
            <input
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="9876543210"
              className={errors.phone ? 'has-error' : ''}
            />
          </Field>

          <Field label="Salary (₹ / year)" required error={errors.salary}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salary}
              onChange={handleChange('salary')}
              placeholder="65000"
              className={errors.salary ? 'has-error' : ''}
            />
          </Field>

          <Field label="Joining Date" required error={errors.joiningDate}>
            <input
              type="date"
              value={form.joiningDate}
              onChange={handleChange('joiningDate')}
              className={errors.joiningDate ? 'has-error' : ''}
            />
          </Field>

          <Field label="Department" required error={errors.departmentId}>
            <select
              value={form.departmentId}
              onChange={handleChange('departmentId')}
              className={errors.departmentId ? 'has-error' : ''}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Role" required error={errors.roleId}>
            <select
              value={form.roleId}
              onChange={handleChange('roleId')}
              className={errors.roleId ? 'has-error' : ''}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="field">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function BackLink() {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => navigate('/employees')}
      style={{ marginBottom: 14, paddingLeft: 4 }}
    >
      <IconArrowLeft /> Back to Employees
    </button>
  );
}

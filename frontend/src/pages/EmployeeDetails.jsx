import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { LoadingState, ErrorState } from '../components/StateBlocks';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate, formatDateTime, initials, colorForKey } from '../utils/format';
import { IconArrowLeft, IconEdit, IconTrash, IconMail, IconPhone, IconCalendar, IconCash } from '../components/icons';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    employeeService
      .getById(id)
      .then(setEmployee)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.remove(id);
      toast.success('Employee deleted successfully.');
      navigate('/employees');
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/employees')} style={{ marginBottom: 14, paddingLeft: 4 }}>
        <IconArrowLeft /> Back to Employees
      </button>

      {loading && (
        <div className="card card-pad">
          <LoadingState rows={5} />
        </div>
      )}

      {!loading && error && (
        <div className="card card-pad">
          <ErrorState description={error} onRetry={load} />
        </div>
      )}

      {!loading && !error && employee && (
        <>
          <div className="page-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: colorForKey(employee.departmentName) + '22',
                  color: colorForKey(employee.departmentName),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                {initials(employee.firstName, employee.lastName)}
              </div>
              <div>
                <h1 className="page-title">{employee.fullName}</h1>
                <p className="page-subtitle">
                  {employee.roleName} · {employee.departmentName}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => navigate(`/employees/${id}/edit`)}>
                <IconEdit /> Edit
              </button>
              <button className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
                <IconTrash /> Delete
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card card-pad">
              <div className="panel-title">Employee Information</div>
              <div className="panel-subtitle">Core profile details</div>

              <DetailRow label="Employee Code" value={<span className="mono">{employee.employeeCode}</span>} />
              <DetailRow label="Status" value={<StatusBadge status={employee.status} />} />
              <DetailRow
                label="Email"
                value={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconMail /> {employee.email}
                  </span>
                }
              />
              <DetailRow
                label="Phone"
                value={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconPhone /> {employee.phone}
                  </span>
                }
              />
              <DetailRow
                label="Salary"
                value={
                  <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconCash /> {formatCurrency(employee.salary)}
                  </span>
                }
              />
              <DetailRow
                label="Joining Date"
                value={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconCalendar /> {formatDate(employee.joiningDate)}
                  </span>
                }
              />
              <DetailRow label="Department" value={employee.departmentName} />
              <DetailRow label="Role" value={employee.roleName} />
            </div>

            <div className="card card-pad">
              <div className="panel-title">Record Metadata</div>
              <div className="panel-subtitle">System-tracked timestamps</div>
              <DetailRow label="Created At" value={formatDateTime(employee.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(employee.updatedAt)} />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this employee?"
        description={
          employee
            ? `Are you sure you want to delete ${employee.fullName} (${employee.employeeCode})? This action cannot be undone.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid var(--color-border)',
        fontSize: 13.5,
      }}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

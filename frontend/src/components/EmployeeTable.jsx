import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { IconEye, IconEdit, IconTrash, IconChevronUpDown } from './icons';
import { formatCurrency, initials, colorForKey } from '../utils/format';

const COLUMNS = [
  { key: 'first_name', label: 'Employee', sortable: true },
  { key: 'employee_code', label: 'Employee Code', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: false },
  { key: 'role', label: 'Role', sortable: false },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

export default function EmployeeTable({ employees, sortBy, sortDirection, onSortChange, onDeleteRequest }) {
  const navigate = useNavigate();

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortBy === col.key) {
      onSortChange(col.key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(col.key, 'asc');
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleSort(col)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.sortable && <IconChevronUpDown />}
                </span>
              </th>
            ))}
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeId}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: colorForKey(emp.departmentName) + '22',
                      color: colorForKey(emp.departmentName),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11.5,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {initials(emp.firstName, emp.lastName)}
                  </div>
                  <span style={{ fontWeight: 600 }}>{emp.fullName}</span>
                </div>
              </td>
              <td className="mono">{emp.employeeCode}</td>
              <td>{emp.email}</td>
              <td>{emp.departmentName}</td>
              <td>{emp.roleName}</td>
              <td className="mono">{formatCurrency(emp.salary)}</td>
              <td>
                <StatusBadge status={emp.status} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="btn-icon"
                    title="View details"
                    onClick={() => navigate(`/employees/${emp.employeeId}`)}
                  >
                    <IconEye />
                  </button>
                  <button
                    className="btn-icon"
                    title="Edit employee"
                    onClick={() => navigate(`/employees/${emp.employeeId}/edit`)}
                  >
                    <IconEdit />
                  </button>
                  <button
                    className="btn-icon"
                    title="Delete employee"
                    onClick={() => onDeleteRequest(emp)}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

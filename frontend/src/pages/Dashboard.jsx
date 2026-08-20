import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StateBlocks';
import { formatCurrency } from '../utils/format';
import { initials, colorForKey } from '../utils/format';
import { IconInbox } from '../components/icons';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Live overview of your workforce, pulled straight from the database.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employees/new')}>
          + Add Employee
        </button>
      </div>

      {loading && <LoadingState rows={4} />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}

      {!loading && !error && stats && (
        <>
          <div className="stats-grid">
            <StatCard label="Total Employees" value={stats.totalEmployees} accent="#2f5fdb" />
            <StatCard label="Active Employees" value={stats.activeEmployees} accent="#187a4c" />
            <StatCard label="Inactive Employees" value={stats.inactiveEmployees} accent="#a6690a" />
            <StatCard label="Departments" value={stats.totalDepartments} accent="#7c3aed" />
            <StatCard label="Roles" value={stats.totalRoles} accent="#0f766e" />
            <StatCard label="Average Salary" value={formatCurrency(stats.averageSalary)} accent="#c53030" />
          </div>

          <div className="dashboard-grid">
            <div className="card card-pad">
              <div className="panel-title">Employees by Department</div>
              <div className="panel-subtitle">Headcount distribution across departments</div>
              {Object.keys(stats.employeesByDepartment || {}).length === 0 ? (
                <EmptyState icon={<IconInbox />} title="No data yet" description="Add employees to see this breakdown." />
              ) : (
                <DepartmentBars data={stats.employeesByDepartment} />
              )}
            </div>

            <div className="card card-pad">
              <div className="panel-title">Recent Employees</div>
              <div className="panel-subtitle">Most recently added to the system</div>
              {(!stats.recentEmployees || stats.recentEmployees.length === 0) ? (
                <EmptyState icon={<IconInbox />} title="No employees yet" />
              ) : (
                <div>
                  {stats.recentEmployees.map((emp) => (
                    <div key={emp.employeeId} className="recent-list-item">
                      <div className="recent-person">
                        <div
                          className="avatar-chip"
                          style={{
                            background: colorForKey(emp.departmentName) + '22',
                            color: colorForKey(emp.departmentName),
                          }}
                        >
                          {initials(emp.firstName, emp.lastName)}
                        </div>
                        <div>
                          <div className="recent-person-name">{emp.fullName}</div>
                          <div className="recent-person-role">
                            {emp.roleName} · {emp.departmentName}
                          </div>
                        </div>
                      </div>
                      <span className="mono" style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
                        {formatCurrency(emp.salary)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card stat-card" style={{ '--stat-accent': accent }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function DepartmentBars({ data }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div>
      {entries.map(([name, count]) => (
        <div className="dept-bar-row" key={name}>
          <div className="dept-bar-label">{name}</div>
          <div className="dept-bar-track">
            <div
              className="dept-bar-fill"
              style={{ width: `${(count / max) * 100}%`, background: colorForKey(name) }}
            />
          </div>
          <div className="dept-bar-count">{count}</div>
        </div>
      ))}
    </div>
  );
}

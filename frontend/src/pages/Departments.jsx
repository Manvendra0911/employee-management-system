import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import departmentService from '../services/departmentService';
import employeeService from '../services/employeeService';
import NameFormModal from '../components/NameFormModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateBlocks';
import { useToast } from '../hooks/useToast';
import { IconPlus, IconEdit, IconBuilding, IconUsers } from '../components/icons';

export default function Departments() {
  const toast = useToast();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([departmentService.getAll(), employeeService.getAll()])
      .then(([deps, employees]) => {
        setDepartments(deps);
        const tally = {};
        employees.forEach((e) => {
          tally[e.departmentId] = (tally[e.departmentId] || 0) + 1;
        });
        setCounts(tally);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    setModalOpen(true);
  };

  const handleSubmit = async ({ name, description }) => {
    setSubmitting(true);
    try {
      if (editing) {
        await departmentService.update(editing.departmentId, { departmentName: name, description });
        toast.success('Department updated successfully.');
      } else {
        await departmentService.create({ departmentName: name, description });
        toast.success('Department created successfully.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Organize employees into departments.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <IconPlus /> Add Department
        </button>
      </div>

      {loading && <LoadingState rows={4} />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}

      {!loading && !error && departments.length === 0 && (
        <EmptyState icon={<IconBuilding />} title="No departments yet" description="Create your first department to get started." />
      )}

      {!loading && !error && departments.length > 0 && (
        <div className="stats-grid">
          {departments.map((dept) => (
            <div key={dept.departmentId} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{dept.departmentName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {dept.description || 'No description'}
                  </div>
                </div>
                <button className="btn-icon" title="Edit department" onClick={() => openEdit(dept)}>
                  <IconEdit />
                </button>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 14, padding: '6px 0' }}
                onClick={() => navigate(`/employees?departmentId=${dept.departmentId}`)}
              >
                <IconUsers /> {counts[dept.departmentId] || 0} employee{(counts[dept.departmentId] || 0) === 1 ? '' : 's'}
              </button>
            </div>
          ))}
        </div>
      )}

      <NameFormModal
        open={modalOpen}
        title={editing ? 'Edit Department' : 'Add Department'}
        nameLabel="Department Name"
        initialValues={editing ? { name: editing.departmentName, description: editing.description } : null}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        submitting={submitting}
      />
    </div>
  );
}

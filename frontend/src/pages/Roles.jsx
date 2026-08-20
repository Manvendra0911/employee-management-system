import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import roleService from '../services/roleService';
import employeeService from '../services/employeeService';
import NameFormModal from '../components/NameFormModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateBlocks';
import { useToast } from '../hooks/useToast';
import { IconPlus, IconEdit, IconBadge, IconUsers } from '../components/icons';

export default function Roles() {
  const toast = useToast();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([roleService.getAll(), employeeService.getAll()])
      .then(([rls, employees]) => {
        setRoles(rls);
        const tally = {};
        employees.forEach((e) => {
          tally[e.roleId] = (tally[e.roleId] || 0) + 1;
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

  const openEdit = (role) => {
    setEditing(role);
    setModalOpen(true);
  };

  const handleSubmit = async ({ name, description }) => {
    setSubmitting(true);
    try {
      if (editing) {
        await roleService.update(editing.roleId, { roleName: name, description });
        toast.success('Role updated successfully.');
      } else {
        await roleService.create({ roleName: name, description });
        toast.success('Role created successfully.');
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
          <h1 className="page-title">Roles</h1>
          <p className="page-subtitle">Manage the job roles used to categorize employees.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <IconPlus /> Add Role
        </button>
      </div>

      {loading && <LoadingState rows={4} />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}

      {!loading && !error && roles.length === 0 && (
        <EmptyState icon={<IconBadge />} title="No roles yet" description="Create your first role to get started." />
      )}

      {!loading && !error && roles.length > 0 && (
        <div className="stats-grid">
          {roles.map((role) => (
            <div key={role.roleId} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{role.roleName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {role.description || 'No description'}
                  </div>
                </div>
                <button className="btn-icon" title="Edit role" onClick={() => openEdit(role)}>
                  <IconEdit />
                </button>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 14, padding: '6px 0' }}
                onClick={() => navigate(`/employees?roleId=${role.roleId}`)}
              >
                <IconUsers /> {counts[role.roleId] || 0} employee{(counts[role.roleId] || 0) === 1 ? '' : 's'}
              </button>
            </div>
          ))}
        </div>
      )}

      <NameFormModal
        open={modalOpen}
        title={editing ? 'Edit Role' : 'Add Role'}
        nameLabel="Role Name"
        initialValues={editing ? { name: editing.roleName, description: editing.description } : null}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        submitting={submitting}
      />
    </div>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import { ToastProvider } from './hooks/useToast';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/roles': 'Roles',
};

function PageShell({ title, children }) {
  return <Layout title={title}>{children}</Layout>;
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <PageShell title={TITLES['/dashboard']}>
              <Dashboard />
            </PageShell>
          }
        />

        <Route
          path="/employees"
          element={
            <PageShell title={TITLES['/employees']}>
              <EmployeeList />
            </PageShell>
          }
        />
        <Route
          path="/employees/new"
          element={
            <PageShell title="Add Employee">
              <EmployeeForm />
            </PageShell>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <PageShell title="Employee Details">
              <EmployeeDetails />
            </PageShell>
          }
        />
        <Route
          path="/employees/:id/edit"
          element={
            <PageShell title="Edit Employee">
              <EmployeeForm />
            </PageShell>
          }
        />

        <Route
          path="/departments"
          element={
            <PageShell title={TITLES['/departments']}>
              <Departments />
            </PageShell>
          }
        />

        <Route
          path="/roles"
          element={
            <PageShell title={TITLES['/roles']}>
              <Roles />
            </PageShell>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
}

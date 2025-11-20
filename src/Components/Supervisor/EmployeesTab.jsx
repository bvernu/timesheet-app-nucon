import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Card from '../Common/Card';
import Button from '../Common/Button';
import InputField from '../Common/InputField';

const EmployeesTab = ({ employees, onRefresh }) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError('');

    alert('To add an employee, they need to sign up using the sign-up form with their email: ' + email);
    setEmail('');
    setShowAddEmployee(false);
  };

  const handleToggleRole = async (employeeId, currentRole) => {
    const newRole = currentRole === 'supervisor' ? 'employee' : 'supervisor';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', employeeId);
    
    if (!error) {
      onRefresh();
    }
  };

  return (
    <div>
      <div className="row mb-3">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Employees</h4>
            <Button onClick={() => setShowAddEmployee(true)} variant="primary">
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {showAddEmployee && (
        <div className="row mb-3">
          <div className="col">
            <Card title="Add Employee">
              <form onSubmit={handleAddEmployee}>
                <InputField
                  label="Employee Email"
                  id="employeeEmail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <p className="text-muted small">
                  The employee will need to sign up with this email address.
                </p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowAddEmployee(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span className={`badge ${
                      employee.role === 'supervisor' 
                        ? 'bg-primary' 
                        : 'bg-success'
                    }`}>
                      {employee.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleRole(employee.id, employee.role)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeesTab;
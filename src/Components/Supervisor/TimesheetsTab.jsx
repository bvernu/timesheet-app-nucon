import { useState } from 'react';
import Card from '../Common/Card';

const TimesheetsTab = ({ timeEntries, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  
  const filteredEntries = selectedEmployee === 'all' 
    ? timeEntries 
    : timeEntries.filter(entry => entry.employee_id === selectedEmployee);

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h4>Employee Timesheets</h4>
        </div>
        <div className="col-md-6 text-end">
          <div className="d-inline-flex align-items-center">
            <label className="me-2">View Employee:</label>
            <select
              className="form-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Employees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Hours</th>
                <th>Project</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const clockInDate = new Date(entry.clock_in);
                const clockOutDate = entry.clock_out ? new Date(entry.clock_out) : null;
                const hours = clockOutDate 
                  ? ((clockOutDate - clockInDate) / (1000 * 60 * 60)).toFixed(2)
                  : 'Ongoing';
                
                return (
                  <tr key={entry.id}>
                    <td className="fw-bold">{entry.profiles?.full_name || 'Unknown'}</td>
                    <td>{clockInDate.toLocaleDateString()}</td>
                    <td>{clockInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{clockOutDate ? clockOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>{hours}</td>
                    <td>{entry.projects?.name || 'Unknown'}</td>
                    <td>{entry.notes || '-'}</td>
                  </tr>
                );
              })}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No time entries found for this employee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TimesheetsTab;
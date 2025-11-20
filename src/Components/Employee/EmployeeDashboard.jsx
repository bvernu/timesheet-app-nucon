import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Card from '../Common/Card';
import Button from '../Common/Button';
import TimeEntryForm from './TimeEntryForm';

const EmployeeDashboard = ({ profile }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadTimeEntries();
    loadProjects();
  }, []);

  const loadTimeEntries = async () => {
    const { data } = await supabase
      .from('time_entries')
      .select(`
        *,
        projects (name)
      `)
      .eq('employee_id', profile.id)
      .order('clock_in', { ascending: false });

    if (data) {
      setTimeEntries(data);
    }
  };

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('name');
    
    if (data) {
      setProjects(data);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await supabase.from('time_entries').delete().eq('id', id);
      loadTimeEntries();
    }
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h2>My Timesheet</h2>
            <Button 
              onClick={() => {
                setShowAddForm(true);
                setEditingEntry(null);
              }}
              variant="primary"
            >
              Add Time Entry
            </Button>
          </div>
        </div>
      </div>

      {(showAddForm || editingEntry) && (
        <div className="row mb-4">
          <div className="col">
            <TimeEntryForm
              profile={profile}
              projects={projects}
              editingEntry={editingEntry}
              onClose={() => {
                setShowAddForm(false);
                setEditingEntry(null);
              }}
              onSave={() => {
                setShowAddForm(false);
                setEditingEntry(null);
                loadTimeEntries();
              }}
            />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <Card>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Hours</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((entry) => {
                    const clockInDate = new Date(entry.clock_in);
                    const clockOutDate = entry.clock_out ? new Date(entry.clock_out) : null;
                    const hours = clockOutDate 
                      ? ((clockOutDate - clockInDate) / (1000 * 60 * 60)).toFixed(2)
                      : 'Ongoing';
                    
                    return (
                      <tr key={entry.id}>
                        <td>{entry.projects?.name}</td>
                        <td>{clockInDate.toLocaleDateString()}</td>
                        <td>{clockInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{clockOutDate ? clockOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td>{hours}</td>
                        <td>{entry.notes || '-'}</td>
                        <td>
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {timeEntries.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No time entries yet. Click "Add Time Entry" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
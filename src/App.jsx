import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://aebabhsyvxejcodouilk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYmFiaHN5dnhlamNvZG91aWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzA5NzYsImV4cCI6MjA3OTE0Njk3Nn0.TrwYtN-DrLxeWAtga36hsUIm9JHoxvR3AGN5HWzI278'
);

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Setting up your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Timesheet App</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile.full_name} ({profile.role})
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {profile.role === 'supervisor' ? (
        <SupervisorDashboard profile={profile} />
      ) : (
        <EmployeeDashboard profile={profile} />
      )}
    </div>
  );
}

// Auth Page Component
function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        alert('Check your email for verification link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Employee Dashboard Component
function EmployeeDashboard({ profile }) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadTimeEntries();
    loadProjects();
  }, []);

  const loadTimeEntries = async () => {
    const { data, error } = await supabase
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Timesheet</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingEntry(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Time Entry
        </button>
      </div>

      {(showAddForm || editingEntry) && (
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
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clock In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clock Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeEntries.map((entry) => {
              const hours = entry.clock_out 
                ? ((new Date(entry.clock_out) - new Date(entry.clock_in)) / (1000 * 60 * 60)).toFixed(2)
                : 'Ongoing';
              
              return (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.projects?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.clock_in).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.clock_out ? new Date(entry.clock_out).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hours}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {entry.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {timeEntries.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No time entries yet. Click "Add Time Entry" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Time Entry Form Component
function TimeEntryForm({ profile, projects, editingEntry, onClose, onSave }) {
  const [projectId, setProjectId] = useState(editingEntry?.project_id || '');
  const [clockIn, setClockIn] = useState(
    editingEntry?.clock_in ? new Date(editingEntry.clock_in).toISOString().slice(0, 16) : ''
  );
  const [clockOut, setClockOut] = useState(
    editingEntry?.clock_out ? new Date(editingEntry.clock_out).toISOString().slice(0, 16) : ''
  );
  const [notes, setNotes] = useState(editingEntry?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!projectId || !clockIn) {
      setError('Project and Clock In time are required');
      return;
    }

    const entryData = {
      employee_id: profile.id,
      project_id: projectId,
      clock_in: clockIn,
      clock_out: clockOut || null,
      notes: notes,
    };

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('time_entries')
          .update(entryData)
          .eq('id', editingEntry.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('time_entries')
          .insert([entryData]);
        
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project *
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock In *
            </label>
            <input
              type="datetime-local"
              value={clockIn}
              onChange={(e) => setClockIn(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock Out
            </label>
            <input
              type="datetime-local"
              value={clockOut}
              onChange={(e) => setClockOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editingEntry ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Supervisor Dashboard Component
function SupervisorDashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('timesheets');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadProjects();
    loadAllTimeEntries();
  }, []);

  const loadEmployees = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    
    if (data) {
      setEmployees(data);
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

  const loadAllTimeEntries = async () => {
    const { data } = await supabase
      .from('time_entries')
      .select(`
        *,
        profiles (full_name),
        projects (name)
      `)
      .order('clock_in', { ascending: false });
    
    if (data) {
      setTimeEntries(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('timesheets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timesheets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Timesheets
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'insights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Insights
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'timesheets' && (
        <TimesheetsTab timeEntries={timeEntries} />
      )}

      {activeTab === 'employees' && (
        <EmployeesTab 
          employees={employees}
          showAddEmployee={showAddEmployee}
          setShowAddEmployee={setShowAddEmployee}
          onRefresh={loadEmployees}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab
          projects={projects}
          showAddProject={showAddProject}
          setShowAddProject={setShowAddProject}
          onRefresh={loadProjects}
        />
      )}

      {activeTab === 'insights' && (
        <InsightsTab 
          timeEntries={timeEntries}
          employees={employees}
          projects={projects}
        />
      )}
    </div>
  );
}

// Timesheets Tab
function TimesheetsTab({ timeEntries }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clock In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clock Out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {timeEntries.map((entry) => {
            const hours = entry.clock_out 
              ? ((new Date(entry.clock_out) - new Date(entry.clock_in)) / (1000 * 60 * 60)).toFixed(2)
              : 'Ongoing';
            
            return (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.profiles?.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.projects?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(entry.clock_in).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.clock_out ? new Date(entry.clock_out).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hours}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {entry.notes || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Employees Tab
function EmployeesTab({ employees, showAddEmployee, setShowAddEmployee, onRefresh }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError('');

    // Note: In production, you'd want a proper invite system
    // For now, this just shows the UI - actual user creation happens through auth signup
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
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {showAddEmployee && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Employee</h3>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                The employee will need to sign up with this email address.
              </p>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddEmployee(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    employee.role === 'supervisor' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleToggleRole(employee.id, employee.role)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Projects Tab
function ProjectsTab({ projects, showAddProject, setShowAddProject, onRefresh }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleAddProject = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase
      .from('projects')
      .insert([{ name, description }]);
    
    if (error) {
      setError(error.message);
    } else {
      setName('');
      setDescription('');
      setShowAddProject(false);
      onRefresh();
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      onRefresh();
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <button
          onClick={() => setShowAddProject(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      {showAddProject && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Project</h3>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {project.description || 'No description'}
            </p>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 text-center text-gray-500 py-8">
            No projects yet. Click "Add Project" to create one.
          </div>
        )}
      </div>
    </div>
  );
}

// Insights Tab
function InsightsTab({ timeEntries, employees, projects }) {
  // Calculate total hours by project
  const projectHours = {};
  const employeeHours = {};

  timeEntries.forEach((entry) => {
    if (entry.clock_out) {
      const hours = (new Date(entry.clock_out) - new Date(entry.clock_in)) / (1000 * 60 * 60);
      
      const projectName = entry.projects?.name || 'Unknown';
      projectHours[projectName] = (projectHours[projectName] || 0) + hours;
      
      const employeeName = entry.profiles?.full_name || 'Unknown';
      employeeHours[employeeName] = (employeeHours[employeeName] || 0) + hours;
    }
  });

  const totalHours = Object.values(projectHours).reduce((sum, h) => sum + h, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Hours Logged</h3>
          <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours by Project</h3>
        <div className="space-y-3">
          {Object.entries(projectHours)
            .sort(([, a], [, b]) => b - a)
            .map(([project, hours]) => (
              <div key={project}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{project}</span>
                  <span className="font-medium text-gray-900">{hours.toFixed(2)} hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(hours / totalHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          {Object.keys(projectHours).length === 0 && (
            <p className="text-gray-500 text-center py-4">No data available yet</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours by Employee</h3>
        <div className="space-y-3">
          {Object.entries(employeeHours)
            .sort(([, a], [, b]) => b - a)
            .map(([employee, hours]) => (
              <div key={employee}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{employee}</span>
                  <span className="font-medium text-gray-900">{hours.toFixed(2)} hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(hours / totalHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          {Object.keys(employeeHours).length === 0 && (
            <p className="text-gray-500 text-center py-4">No data available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
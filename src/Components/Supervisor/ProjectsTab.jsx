import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Card from '../Common/Card';
import Button from '../Common/Button';
import InputField from '../Common/InputField';

const ProjectsTab = ({ projects, onRefresh }) => {
  const [showAddProject, setShowAddProject] = useState(false);
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
      <div className="row mb-3">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Projects</h4>
            <Button onClick={() => setShowAddProject(true)} variant="primary">
              Add Project
            </Button>
          </div>
        </div>
      </div>

      {showAddProject && (
        <div className="row mb-3">
          <div className="col">
            <Card title="Add Project">
              <form onSubmit={handleAddProject}>
                <InputField
                  label="Project Name"
                  id="projectName"
                  value={name}
                  onChange={setName}
                  required
                />

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

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
                    onClick={() => setShowAddProject(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      <div className="row">
        {projects.map((project) => (
          <div key={project.id} className="col-md-4 mb-3">
            <Card>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="mb-0">{project.name}</h5>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </div>
              <p className="text-muted mb-0">
                {project.description || 'No description'}
              </p>
            </Card>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-12">
            <Card>
              <div className="text-center text-muted py-4">
                No projects yet. Click "Add Project" to create one.
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
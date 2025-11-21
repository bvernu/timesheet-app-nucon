import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Card from '../Common/Card';
import Button from '../Common/Button';
import InputField from '../Common/InputField';

const ProjectForm = ({ project, employees, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    type: project?.type || 'DGN',
    company_name: project?.company_name || '',
    contact_person: project?.contact_person || '',
    email: project?.email || '',
    phone: project?.phone || '',
    job_description: project?.job_description || '',
    address: project?.address || '',
    status: project?.status || 'in progress',
    quotation_amount: project?.quotation_amount || '',
    quotation_date: project?.quotation_date || '',
    invoice_amount: project?.invoice_amount || '',
    invoice_date: project?.invoice_date || '',
    payment_amount: project?.payment_amount || '',
    payment_date: project?.payment_date || '',
    project_lead_id: project?.project_lead_id || ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.type || !formData.company_name) {
      setError('Project name, type, and company name are required');
      setLoading(false);
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        quotation_amount: formData.quotation_amount ? parseFloat(formData.quotation_amount) : null,
        invoice_amount: formData.invoice_amount ? parseFloat(formData.invoice_amount) : null,
        payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null,
        project_lead_id: formData.project_lead_id || null
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', project.id);
        
        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={project ? `Edit Project #${project.serial_number}` : 'Add New Project'}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Basic Information */}
          <div className="col-md-6">
            <h6 className="text-muted mb-3">Basic Information</h6>
            
            <InputField
              label="Project Name"
              id="name"
              value={formData.name}
              onChange={(val) => handleChange('name', val)}
              required
            />

            <div className="mb-3">
              <label className="form-label">
                Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <option value="DGN">DGN - Design</option>
                <option value="DET">DET - Detailing</option>
                <option value="FAB">FAB - Fabrication</option>
                <option value="CON">CON - Construction</option>
                <option value="FNE">FNE - Finishing</option>
                <option value="DEF">DEF - Deficiency</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                <option value="quote sent">Quote Sent</option>
                <option value="in progress">In Progress</option>
                <option value="40%">40%</option>
                <option value="50% completed">50% Completed</option>
                <option value="60%">60%</option>
                <option value="invoiced">Invoiced</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Project Lead</label>
              <select
                className="form-select"
                value={formData.project_lead_id}
                onChange={(e) => handleChange('project_lead_id', e.target.value)}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Job Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.job_description}
                onChange={(e) => handleChange('job_description', e.target.value)}
              />
            </div>
          </div>

          {/* Contact & Financial Information */}
          <div className="col-md-6">
            <h6 className="text-muted mb-3">Contact Information</h6>
            
            <InputField
              label="Company Name"
              id="company_name"
              value={formData.company_name}
              onChange={(val) => handleChange('company_name', val)}
              required
            />

            <InputField
              label="Contact Person"
              id="contact_person"
              value={formData.contact_person}
              onChange={(val) => handleChange('contact_person', val)}
            />

            <InputField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(val) => handleChange('email', val)}
            />

            <InputField
              label="Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(val) => handleChange('phone', val)}
            />

            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="row mt-3">
          <div className="col-12">
            <h6 className="text-muted mb-3">Financial Information</h6>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold">Quotation</h6>
            <InputField
              label="Amount"
              id="quotation_amount"
              type="number"
              value={formData.quotation_amount}
              onChange={(val) => handleChange('quotation_amount', val)}
            />
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.quotation_date}
                onChange={(e) => handleChange('quotation_date', e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold">Invoice</h6>
            <InputField
              label="Amount"
              id="invoice_amount"
              type="number"
              value={formData.invoice_amount}
              onChange={(val) => handleChange('invoice_amount', val)}
            />
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.invoice_date}
                onChange={(e) => handleChange('invoice_date', e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold">Payment</h6>
            <InputField
              label="Amount"
              id="payment_amount"
              type="number"
              value={formData.payment_amount}
              onChange={(val) => handleChange('payment_amount', val)}
            />
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.payment_date}
                onChange={(e) => handleChange('payment_date', e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="d-flex gap-2 mt-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProjectForm;
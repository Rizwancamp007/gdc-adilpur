import { useState, useEffect } from 'react';
import { HiArrowLeft, HiSave, HiX, HiPlus, HiTrash } from 'react-icons/hi';

/**
 * Generic CRUD Form component.
 *
 * Props:
 *  - title: string
 *  - fields: [{ name, label, type, required, options, placeholder, hint, rows }]
 *    type: 'text' | 'email' | 'textarea' | 'number' | 'url' | 'select' | 'toggle' | 'date' | 'array' | 'feeBreakdown'
 *  - initialData: object | null (null = create mode)
 *  - onSubmit: (formData) => Promise<void>
 *  - onCancel: () => void
 *  - loading: bool
 *  - submitLabel?: string
 */
const CrudForm = ({
  title,
  fields,
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      const data = { ...initialData };
      // Convert dates to input format
      fields.forEach((f) => {
        if (f.type === 'date' && data[f.name]) {
          data[f.name] = new Date(data[f.name]).toISOString().split('T')[0];
        }
      });
      setFormData(data);
    } else {
      const defaults = {};
      fields.forEach((f) => {
        if (f.type === 'toggle') defaults[f.name] = f.defaultValue ?? true;
        else if (f.type === 'array') defaults[f.name] = [''];
        else if (f.type === 'feeBreakdown') defaults[f.name] = [{ label: '', amount: '' }];
        else if (f.type === 'number') defaults[f.name] = '';
        else defaults[f.name] = f.defaultValue ?? '';
      });
      setFormData(defaults);
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayAdd = (name) => {
    setFormData((prev) => ({ ...prev, [name]: [...(prev[name] || []), ''] }));
  };

  const handleArrayRemove = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (name, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((v, i) => (i === index ? value : v)),
    }));
  };

  const handleFeeAdd = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), { label: '', amount: '' }],
    }));
  };

  const handleFeeRemove = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const handleFeeChange = (name, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEdit = !!initialData;

  const renderField = (field) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className="form-textarea"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            required={field.required}
            rows={field.rows || 4}
          />
        );

      case 'select':
        return (
          <select
            className="form-select"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {(field.options || []).map((opt) => (
              <option key={typeof opt === 'object' ? opt.value : opt}
                value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <div
            className={`toggle ${value ? 'active' : ''}`}
            onClick={() => handleChange(field.name, !value)}
            role="switch"
            aria-checked={value}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleChange(field.name, !value)}
          >
            <div className="toggle-knob" />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            value={value ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={field.placeholder || ''}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className="form-input"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case 'array':
        return (
          <div>
            {(value || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={item}
                  onChange={(e) => handleArrayChange(field.name, idx, e.target.value)}
                  placeholder={field.placeholder || `Item ${idx + 1}`}
                />
                <button type="button" className="btn btn-ghost btn-icon"
                  onClick={() => handleArrayRemove(field.name, idx)}
                  style={{ color: 'var(--color-danger)', flexShrink: 0 }}>
                  <HiTrash />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => handleArrayAdd(field.name)}>
              <HiPlus /> Add Item
            </button>
          </div>
        );

      case 'feeBreakdown':
        return (
          <div>
            {(value || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  value={item.label || ''}
                  onChange={(e) => handleFeeChange(field.name, idx, 'label', e.target.value)}
                  placeholder="Fee label (e.g. Tuition Fee)"
                  style={{ flex: 2 }}
                />
                <input
                  type="number"
                  className="form-input"
                  value={item.amount ?? ''}
                  onChange={(e) => handleFeeChange(field.name, idx, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Amount (PKR)"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-ghost btn-icon"
                  onClick={() => handleFeeRemove(field.name, idx)}
                  style={{ color: 'var(--color-danger)', flexShrink: 0 }}>
                  <HiTrash />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => handleFeeAdd(field.name)}>
              <HiPlus /> Add Fee Row
            </button>
          </div>
        );

      default: // text, email, url
        return (
          <input
            type={field.type || 'text'}
            className="form-input"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-icon" onClick={onCancel} title="Go back">
          <HiArrowLeft style={{ fontSize: '1.25rem' }} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      {/* Form Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        maxWidth: '720px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label className="form-label">
                {field.label}
                {field.required && <span style={{ color: 'var(--color-danger)', marginLeft: '0.25rem' }}>*</span>}
              </label>
              {renderField(field)}
              {field.hint && <p className="form-hint">{field.hint}</p>}
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (
                <><HiSave /> {submitLabel || (isEdit ? 'Update' : 'Create')}</>
              )}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              <HiX /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrudForm;

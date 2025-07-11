import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateGroup, deleteGroup } from '../redux/groupSlice';

// GroupCard Component
export function GroupCard({ group, onClick }) {
  const memberCount = group.members.length;
  const createdDate = new Date(group.createdAt).toLocaleDateString();

  return (
    <div className="group-card" onClick={onClick}>
      <div className="group-card-header">
        <h3>{group.name}</h3>
        <span className="member-count">{memberCount} members</span>
      </div>
      
      <p className="group-description">{group.description}</p>
      
      <div className="group-card-footer">
        <span className="created-date">Created: {createdDate}</span>
        <div className="group-members-preview">
          {group.members.slice(0, 3).map((member, index) => (
            <div key={member._id} className="member-avatar" title={member.name}>
              {member.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {memberCount > 3 && (
            <div className="member-avatar more">+{memberCount - 3}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// CreateGroupModal Component
export function CreateGroupModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmails: []
  });
  const [emailInput, setEmailInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !formData.memberEmails.includes(email)) {
      setFormData(prev => ({
        ...prev,
        memberEmails: [...prev.memberEmails, email]
      }));
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      memberEmails: prev.memberEmails.filter(email => email !== emailToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', memberEmails: [] });
    setEmailInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="group-form">
          <div className="form-group">
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter group name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your study group"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Invite Members (Optional)</label>
            <div className="email-input-group">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
              />
              <button type="button" onClick={handleAddEmail}>Add</button>
            </div>
            
            {formData.memberEmails.length > 0 && (
              <div className="email-tags">
                {formData.memberEmails.map((email, index) => (
                  <span key={index} className="email-tag">
                    {email}
                    <button type="button" onClick={() => handleRemoveEmail(email)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// GroupDetailsModal Component
export function GroupDetailsModal({ isOpen, onClose, group }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    memberEmails: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize edit data when group changes
  useEffect(() => {
    if (group) {
      setEditData({
        name: group.name,
        description: group.description,
        memberEmails: group.members.map(member => member.email)
      });
    }
  }, [group]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (group) {
      setEditData({
        name: group.name,
        description: group.description,
        memberEmails: group.members.map(member => member.email)
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateGroup({ 
        id: group._id, 
        groupData: editData 
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteGroup(group._id)).unwrap();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !editData.memberEmails.includes(email)) {
      setEditData(prev => ({
        ...prev,
        memberEmails: [...prev.memberEmails, email]
      }));
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEditData(prev => ({
      ...prev,
      memberEmails: prev.memberEmails.filter(email => email !== emailToRemove)
    }));
  };

  if (!isOpen || !group) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content group-details-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Group' : group.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="group-details">
          {!isEditing ? (
            <>
              <div className="group-info">
                <h3>Description</h3>
                <p>{group.description}</p>
              </div>

              <div className="group-members">
                <h3>Members ({group.members.length})</h3>
                <div className="members-list">
                  {group.members.map((member) => (
                    <div key={member._id} className="member-item">
                      <div className="member-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-email">{member.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group-meta">
                <p><strong>Created:</strong> {new Date(group.createdAt).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(group.updatedAt).toLocaleDateString()}</p>
              </div>
            </>
          ) : (
            <form className="group-form">
              <div className="form-group">
                <label htmlFor="edit-name">Group Name *</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description *</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Members</label>
                <div className="email-input-group">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Add member email"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                  />
                  <button type="button" onClick={handleAddEmail}>Add</button>
                </div>
                
                {editData.memberEmails.length > 0 && (
                  <div className="email-tags">
                    {editData.memberEmails.map((email, index) => (
                      <span key={index} className="email-tag">
                        {email}
                        <button type="button" onClick={() => handleRemoveEmail(email)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="modal-actions">
          {!isEditing ? (
            <>
              <button onClick={handleEdit} className="btn-secondary">
                Edit Group
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="btn-danger"
              >
                Delete Group
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancelEdit} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="btn-primary">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h3>Delete Group</h3>
            <p>Are you sure you want to delete "{group.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
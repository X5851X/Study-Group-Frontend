import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchGroups, createGroup, updateGroup, deleteGroup, clearError } from '../redux/groupSlice';
import Navbar from '../components/navbar';
import axios from 'axios';
import '../styles/dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.user);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmails: ''
  });
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    groupId: null,
    groupName: ''
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchGroups());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      showPopup('error', 'Error', error.message || 'Failed to update group');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      memberEmails: ''
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.description.trim()) {
      showPopup('error', 'Validation Error', 'Name and description are required');
      return;
    }

    try {
      // Convert email string to array
      const memberEmails = formData.memberEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        memberEmails: memberEmails
      };

      await dispatch(createGroup(groupData)).unwrap();
      
      // Reset form
      resetForm();
      setShowCreateForm(false);
      showPopup('success', 'Success', 'Group created successfully!');
    } catch (error) {
      console.error('Create group error:', error);
      showPopup('error', 'Error', error.message || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.description.trim()) {
      showPopup('error', 'Validation Error', 'Name and description are required');
      return;
    }

    try {
      // Convert email string to array
      const memberEmails = formData.memberEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        memberEmails: memberEmails
      };

      await dispatch(updateGroup({ 
        id: editingGroup._id, 
        data: groupData 
      })).unwrap();
      
      // Reset form
      resetForm();
      setShowEditForm(false);
      setEditingGroup(null);
      setSelectedGroup(null);
      showPopup('success', 'Success', 'Group updated successfully!');
    } catch (error) {
      console.error('Update group error:', error);
      showPopup('error', 'Error', error.message || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await dispatch(deleteGroup(groupId)).unwrap();
      setConfirmDelete({ isOpen: false, groupId: null, groupName: '' });
      setSelectedGroup(null);
      showPopup('success', 'Success', 'Group deleted successfully!');
    } catch (error) {
      console.error('Delete group error:', error);
      showPopup('error', 'Error', error.message || 'Failed to delete group');
    }
  };

  const handleCancelCreate = () => {
    resetForm();
    setShowCreateForm(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowEditForm(false);
    setEditingGroup(null);
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(selectedGroup?._id === group._id ? null : group);
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      memberEmails: group.members?.map(member => member.email).join(', ') || ''
    });
    setShowEditForm(true);
    setSelectedGroup(null);
  };

  const handleDeleteClick = (group) => {
    setConfirmDelete({
      isOpen: true,
      groupId: group._id,
      groupName: group.name
    });
  };

  const handleViewRooms = (group) => {
    navigate(`/rooms/${group._id}`);
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, groupId: null, groupName: '' });
  };

  // Auto-close popup after delay
  useEffect(() => {
    if (popup.isOpen && (popup.type === 'success' || popup.type === 'info')) {
      const timer = setTimeout(() => {
        closePopup();
      }, popup.type === 'success' ? 3000 : 4000);
      
      return () => clearTimeout(timer);
    }
  }, [popup.isOpen, popup.type]);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p>Manage your study groups and collaborate with your peers</p>
          </div>
          
          <button 
            className="create-group-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '✕ Cancel' : '+ Create New Group'}
          </button>
        </div>

        <div className="dashboard-content">
          <div className="groups-section">
            {/* Create Group Form */}
            {showCreateForm && (
              <div className="create-group-form">
                <h3>Create New Study Group</h3>
                <form onSubmit={handleCreateGroup}>
                  <div className="form-group">
                    <label htmlFor="name">Group Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your study group"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="memberEmails">Member Emails (optional)</label>
                    <input
                      type="text"
                      id="memberEmails"
                      name="memberEmails"
                      value={formData.memberEmails}
                      onChange={handleInputChange}
                      placeholder="Enter emails separated by commas (e.g., user1@email.com, user2@email.com)"
                    />
                    <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Separate multiple emails with commas
                    </small>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={handleCancelCreate}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Group'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Group Form */}
            {showEditForm && editingGroup && (
              <div className="edit-group-form">
                <h3>Edit Study Group</h3>
                <form onSubmit={handleUpdateGroup}>
                  <div className="form-group">
                    <label htmlFor="edit-name">Group Name *</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-description">Description *</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your study group"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-memberEmails">Member Emails (optional)</label>
                    <input
                      type="text"
                      id="edit-memberEmails"
                      name="memberEmails"
                      value={formData.memberEmails}
                      onChange={handleInputChange}
                      placeholder="Enter emails separated by commas (e.g., user1@email.com, user2@email.com)"
                    />
                    <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Separate multiple emails with commas
                    </small>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Group'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <h2>Your Groups ({groups?.length || 0})</h2>
            
            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading groups...</p>
              </div>
            )}

            {!loading && (!groups || groups.length === 0) && (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No groups yet</h3>
                <p>Create your first study group to get started!</p>
                <button 
                  className="create-first-group-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  Create Your First Group
                </button>
              </div>
            )}

            {!loading && groups && groups.length > 0 && (
              <div className="groups-grid">
                {groups.map((group) => (
                  <div key={group._id}>
                    <div 
                      className="group-card"
                      onClick={() => handleGroupClick(group)}
                    >
                      <h3>{group.name}</h3>
                      <p>{group.description}</p>
                      <div className="group-meta">
                        <span className="group-members">
                          {group.members?.length || 0} members
                        </span>
                        <span className="group-status active">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Group Details (Expandable) */}
                    {selectedGroup?._id === group._id && (
                      <div className="group-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3>Group Details</h3>
                          <button 
                            className="close-details"
                            onClick={() => setSelectedGroup(null)}
                          >
                            ✕
                          </button>
                        </div>

                        <div className="detail-item">
                          <strong>Name:</strong> {group.name}
                        </div>

                        <div className="detail-item">
                          <strong>Description:</strong> {group.description}
                        </div>

                        <div className="detail-item">
                          <strong>Created:</strong> {new Date(group.createdAt).toLocaleDateString()}
                        </div>

                        <div className="detail-item">
                          <strong>Members ({group.members?.length || 0}):</strong>
                          <div className="members-list">
                            {group.members?.map((member) => (
                              <span key={member._id} className="member-tag">
                                {member.name} ({member.email})
                              </span>
                            )) || (
                              <span style={{ color: '#666' }}>No members loaded</span>
                            )}
                          </div>
                        </div>

                        <div className="detail-item">
                          <strong>Group ID:</strong> {group._id}
                        </div>

                        {/* Action Buttons */}
                        <div className="group-actions">
                          <button 
                            className="btn-view-rooms"
                            onClick={() => handleViewRooms(group)}
                          >
                            🏠 View Rooms
                          </button>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditClick(group)}
                          >
                            ✏️ Edit Group
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteClick(group)}
                          >
                            🗑️ Delete Group
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <h3>Total Groups</h3>
              <p className="stat-number">{groups?.length || 0}</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Members</h3>
              <p className="stat-number">
                {groups?.reduce((total, group) => total + (group.members?.length || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete the group "<strong>{confirmDelete.groupName}</strong>"?</p>
              <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteGroup(confirmDelete.groupId)}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Group'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Notifications */}
        {popup.isOpen && (
          <div className={`popup ${popup.type}`}>
            <button className="popup-close" onClick={closePopup}>
              ×
            </button>
            <h4>{popup.title}</h4>
            <p>{popup.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
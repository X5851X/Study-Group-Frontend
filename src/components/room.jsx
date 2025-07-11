import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/room.css';

const Room = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const [rooms, setRooms] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    if (groupId && user) {
      fetchRooms();
      fetchGroupInfo();
    }
  }, [groupId, user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rooms/${groupId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setRooms(response.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/groups/${groupId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setGroupInfo(response.data);
    } catch (err) {
      console.error('Error fetching group info:', err);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      showPopup('error', 'Validation Error', 'Room name is required');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/rooms`,
        {
          name: roomName.trim(),
          group: groupId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setRooms(prev => [...prev, response.data]);
      setRoomName('');
      setShowCreateForm(false);
      showPopup('success', 'Success', 'Room created successfully!');
    } catch (err) {
      console.error('Error creating room:', err);
      showPopup('error', 'Error', err.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

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

  const handleRoomClick = (room) => {
    // Navigate to specific room - you can implement this later
    console.log('Entering room:', room);
    // navigate(`/room/${room._id}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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

  if (loading) {
    return (
      <div className="room-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-nav">
          <button 
            className="back-btn"
            onClick={handleBackToDashboard}
          >
            ← Back to Dashboard
          </button>
          <div className="room-title">
            <h1>Study Rooms</h1>
            {groupInfo && (
              <p>Group: {groupInfo.name}</p>
            )}
          </div>
        </div>
        
        <button 
          className="create-room-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancel' : '+ Create New Room'}
        </button>
      </div>

      <div className="room-content">
        {/* Create Room Form */}
        {showCreateForm && (
          <div className="create-room-form">
            <h3>Create New Study Room</h3>
            <form onSubmit={createRoom}>
              <div className="form-group">
                <label htmlFor="roomName">Room Name *</label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name (e.g., Math Study Session, Literature Discussion)"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setRoomName('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rooms List */}
        <div className="rooms-section">
          <h2>Available Rooms ({rooms.length})</h2>
          
          {rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No rooms yet</h3>
              <p>Create your first study room to start collaborating!</p>
              <button 
                className="create-first-room-btn"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Room
              </button>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div 
                  key={room._id}
                  className="room-card"
                  onClick={() => handleRoomClick(room)}
                >
                  <div className="room-card-header">
                    <h3>{room.name}</h3>
                    <span className="room-status active">Active</span>
                  </div>
                  
                  <div className="room-card-body">
                    <div className="room-meta">
                      <span className="room-created">
                        Created: {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="room-actions">
                      <button 
                        className="btn-join"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomClick(room);
                        }}
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room Stats */}
        <div className="room-stats">
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p className="stat-number">{rooms.length}</p>
          </div>
          
          <div className="stat-card">
            <h3>Group Members</h3>
            <p className="stat-number">{groupInfo?.members?.length || 0}</p>
          </div>
        </div>
      </div>

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
  );
};

export default Room;
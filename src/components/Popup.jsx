// src/components/Popup.jsx
import { useState, useEffect } from 'react';
import '../styles/popup.css';

export default function Popup({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  autoClose = true, 
  autoCloseDelay = 4000,
  showCloseButton = true,
  actions = null 
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoClose) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return prev - (100 / (autoCloseDelay / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setProgress(100);
    }, 200);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'i';
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error';
      case 'info':
      default:
        return 'Information';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`popup-container ${type} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button className="popup-close" onClick={handleClose}>
            ×
          </button>
        )}
        
        <div className="popup-header">
          <div className={`popup-icon ${type}`}>
            {getIcon()}
          </div>
          <h3 className="popup-title">{getTitle()}</h3>
        </div>
        
        <div className="popup-message">
          {message}
        </div>
        
        {actions ? (
          <div className="popup-actions">
            {actions}
          </div>
        ) : (
          <div className="popup-actions">
            <button className="popup-button primary" onClick={handleClose}>
              OK
            </button>
          </div>
        )}
        
        {autoClose && (
          <div className="popup-progress">
            <div 
              className={`popup-progress-bar ${type}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
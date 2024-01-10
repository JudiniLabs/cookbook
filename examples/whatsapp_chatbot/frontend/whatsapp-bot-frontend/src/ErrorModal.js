import React, {useEffect} from 'react';
import './ErrorModal.css';

const ErrorModal = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  return error ? (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>&times;</span>
        <p>{error}</p>
      </div>
    </div>
  ) : null;
};

export default ErrorModal;
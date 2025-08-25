import React from "react";
import '../../css/admin/admin.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {onCancel && <button className="gray-btn" onClick={onCancel}>취소</button>}
          {onConfirm && <button className="pBtn" onClick={onConfirm}>확인</button>}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

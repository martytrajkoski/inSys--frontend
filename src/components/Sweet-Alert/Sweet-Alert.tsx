import React from 'react';

interface SweetAlertProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SweetAlert: React.FC<SweetAlertProps> = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="sweet-alert">
      <div className="alert-content">
        <h2>Потврда</h2>
        <p>Дали сте сигурни дека сакате да ја одобрите фактурата?</p>
        <div className="buttons">
          <button className="confirm" onClick={onConfirm}>Одобри</button>
          <button className="cancel" onClick={onCancel}>Откажи</button>
        </div>
      </div>
    </div>
  );
};

export default SweetAlert;

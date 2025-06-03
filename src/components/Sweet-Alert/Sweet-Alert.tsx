interface SweetAlertProps {
  visibility: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirmButton: string;
}

const SweetAlert: React.FC<SweetAlertProps> = ({ onConfirm, onCancel, message, visibility, confirmButton }) => {
  if (!visibility) return null;

  return (
    <div className="sweet-alert">
      <div className="alert-content">
        <h2>Известување !</h2>
        <p>{message}</p>
        <div className="buttons">
          {confirmButton.length > 1 ? (
              <>
                <button className="confirm" onClick={onConfirm}>{confirmButton}</button>
                <button className="cancel" onClick={onCancel}>Откажи</button>
              </>
            ) : (
              <button className="cancel" onClick={onCancel}>Во ред</button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SweetAlert;
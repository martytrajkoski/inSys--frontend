import React, { useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { Props } from "../../types/types";

const PasswordChangeModal: React.FC<Props> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);
    try {
      const res = await axiosClient.patch("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage("Failed to change password.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="title">
          <h2>Промени лозинка</h2>
          <button className="close-button" onClick={() => onClose?.()}>
            x
          </button>{" "}
        </div>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="update-button">
          <button onClick={handleChangePassword}>Зачувај</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PasswordChangeModal;

import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import PasswordChangeModal from "./PasswordChangeModal";
import type { PropsModal } from "../../types/types";

const ProfileModal: React.FC<PropsModal> = ({ onClose }) => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    axiosClient.get("/auth/user").then((res) => {
      setUser(res.data);
    });
  }, []);

  const handleUpdate = async () => {
    setMessage(null);
    try {
      const res = await axiosClient.patch("/auth/update-user", user);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage("Failed to update user.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="title">
          <h2>Мој Профил</h2>
          <button className="close-button" onClick={() => onClose?.()}>
            x
          </button>
        </div>
        <label>Име:</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <label>E-mail:</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <div className="update-button">
          <button onClick={handleUpdate}>Зачувај</button>
          <button onClick={() => setShowPasswordModal(true)}>
            Промени лозинка
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfileModal;

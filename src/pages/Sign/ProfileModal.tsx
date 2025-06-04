import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import PasswordChangeModal from "./PasswordChangeModal";
import type { PropsModal } from "../../types/types";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileModal: React.FC<PropsModal> = ({ onClose }) => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axiosClient.get("/auth/user").then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
      <div className="modal-content" ref={modalRef}>
        <div className="title">
          <h2>Мој Профил</h2>
          <FontAwesomeIcon icon={faClose} className="close-button" onClick={() => onClose?.()}/>
        </div>
        <div className="label-input">
          <label>Име:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="label-input">
          <label>E-mail:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
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

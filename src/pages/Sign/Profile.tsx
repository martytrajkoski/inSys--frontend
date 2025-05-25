import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { RoleType, UserType } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserType>();
    const [role, setRole] = useState<RoleType>();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [resetEmail, setResetEmail] = useState<string>("");
    const [resetMessage, setResetMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await axiosClient.get('/auth/user');
            if (response.status === 200) {
                setUser(response.data);
                setResetEmail(response.data.email);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchRole = async () => {
        try {
            if (!user?.role_id) return;
            const response = await axiosClient.get(`/roles/show/${user.role_id}`);
            if (response.status === 201) {
                setRole(response.data.role);
            }
        } catch (error) {
            console.error("Error fetching role:", error);
        }
    };

    const handleForgotPassword = async () => {
        setResetMessage(null);
        try {
            await axiosClient.get("/auth/reset-password", {
                params: { email: resetEmail },
            });
            setResetMessage("Password reset instructions sent to your email.");
        } catch (err: any) {
            setResetMessage("Failed to send reset instructions. Please try again.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchRole();
    }, [user?.role_id]);

    return (
        <div className="profile">
            <div className="profile-container">
                <div className="profile-navigation">
                    <FontAwesomeIcon icon={faClose} onClick={()=>navigate(-1)} />
                </div>
                <div className="profile-info">
                    <div className="profile-item">
                        <label><b>Full Name: </b></label>
                        {user?.name}
                    </div>
                    <div className="profile-item">
                        <label><b>Email: </b></label>
                        {user?.email}
                    </div>
                    <div className="profile-item">
                        <label><b>Role: </b></label>
                        {role?.name}
                    </div>
                    <div className="profile-buttons">
                        <button onClick={() => setShowModal(true)}>Reset Password</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="forgot-password-modal-overlay">
                    <div className="forgot-password-modal-content">
                        <h3>Reset Password</h3>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                        />

                        <button onClick={handleForgotPassword} className="submit-button">
                            Send Reset Link
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setResetMessage(null);
                            }}
                            className="cancel-button"
                        >
                            Cancel
                        </button>

                        {resetMessage && (
                            <p
                                className={`message ${
                                    resetMessage.includes("instructions") ? "success" : "error"
                                }`}
                            >
                                {resetMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

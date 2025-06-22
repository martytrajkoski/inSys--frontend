import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { UserType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/Logo/Asset_2.png";
import ProfileModal from "../../pages/Sign/ProfileModal";

const Header: React.FC = () => {
  const [user, setUser] = useState<UserType>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/auth/user");
      if (response.status === 201) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const response = await axiosClient.post("/auth/logout");
      if (response.status === 200) {
        localStorage.removeItem("inSys");
      }

      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="header">
        <div className="header-info">
          <img src={logo} alt="Лого" />
          <div className="header-title">
            <p>Универзитет “Св. Кирил и Методиј” во Скопје</p>
            <p>Машински факултет - Скопје</p>
          </div>
        </div>
        <div className="header-user">
          <span
            onClick={() => setShowProfileModal(true)}
            style={{ cursor: "pointer" }}
          >
            {user?.name}
          </span>
          <button onClick={logout}>Одјави се</button>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export default Header;

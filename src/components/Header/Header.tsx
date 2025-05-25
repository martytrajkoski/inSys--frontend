import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { UserType } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Logo/Asset_2.png";

const Header: React.FC = () => {
  const [user, setUser] = useState<UserType>();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/auth/user");
      if (response.status === 200) {
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
        console.log("logout", response.data.message);
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
    <div className="header">
      <div className="header-info">
        <img src={logo} alt="Лого" />
        <div className="header-title">
          <p>Универзитет “Св. Кирил и Методиј” во Скопје</p>
          <p>Машински факултет - Скопје</p>
        </div>
      </div>
      <div className="header-user">
        <Link to='/profile'>{user?.name}</Link>
        <button onClick={logout}>Одјави се</button>
      </div>
    </div>
  );
};

export default Header;

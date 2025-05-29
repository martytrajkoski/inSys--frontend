import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../Logo/Asset_3.png";

const MainMenuSidebar: React.FC = () => {
  return (
    <div className="mainmenu-sidebar-backdrop">
      <div className="mainmenu-sidebar">
        <div className="sidebar-items">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Преглед на фактури
          </NavLink>
          <NavLink
            to="/lista-barateli"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Преглед на баратели на набавка
          </NavLink>
          <NavLink
            to="/lista-izdavaci"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Преглед на издавачи
          </NavLink>
          <NavLink
            to={"/archive"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Архива на фактури
          </NavLink>
        </div>
        <div className="sidebar-user">
          <img src={logo} alt="Лого" />
        </div>
      </div>
    </div>
  );
};

export default MainMenuSidebar;

import React from "react";
import { Link } from "react-router-dom";
import logo from "../Logo/Asset_3.png";

const MainMenuSidebar: React.FC = () => {
  return (
    <div className="mainmenu-sidebar-backdrop">
      <div className="mainmenu-sidebar">
        <div className="sidebar-items">
          <Link to="/lista-fakturi">Преглед на фактури</Link>
          <Link to="/lista-barateli">Преглед на баратели на набавка</Link>
          <Link to="/lista-izdavaci">Преглед на издавачи</Link>
        </div>
        <div className="sidebar-user">
          <img src={logo} alt="Лого" />
        </div>
      </div>
    </div>
  );
};

export default MainMenuSidebar;

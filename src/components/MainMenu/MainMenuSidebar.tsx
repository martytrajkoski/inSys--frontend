import React from "react";
import { Link } from "react-router-dom";

const MainMenuSidebar: React.FC = () => {
  return (
    <div className="mainmenu-sidebar-backdrop">
      <div className="mainmenu-sidebar">
        <div className="sidebar-items">
          <p>Преглед на фактури</p>
          <Link to="/lista-barateli">Преглед на баратели на набавка</Link>
          <Link to="/lista-izdavaci">Преглед на издавачи</Link>
        </div>
        <div className="sidebar-user">
          <p>Petar Petreski</p>
          <button>Одјави се</button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuSidebar;

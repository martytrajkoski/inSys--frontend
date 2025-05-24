import React from "react";
import MainMenuSidebar from "../../components/MainMenu/MainMenuSidebar";
import { Outlet } from "react-router-dom";

const MainMenu: React.FC = () => {
  return (
    <div className="mainmenu">
      <MainMenuSidebar />
      <Outlet />
    </div>
  );
};

export default MainMenu;

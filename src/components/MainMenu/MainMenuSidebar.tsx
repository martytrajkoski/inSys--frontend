import React from "react";

const MainMenuSidebar: React.FC = () => {
    return(
        <div className="mainmenu-sidebar-backdrop">
            <div className="mainmenu-sidebar">
                <div className="sidebar-items">
                    <p>Преглед на фактури</p>
                    <p>Преглед на баратели  на набавка</p>
                    <p>Преглед на издавачи</p>
                </div>
                <div className="sidebar-user">
                    <p>Petar Petreski</p>
                    <button>Одјави се</button>
                </div>
            </div>
        </div>
    )
}

export default MainMenuSidebar;
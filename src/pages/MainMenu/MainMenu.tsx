import React from "react";
import MainMenuSidebar from "../../components/MainMenu/MainMenuSidebar";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";

const MainMenu: React.FC = () => {
    return(
        <div className="mainmenu">
            <MainMenuSidebar/>
            <div className="mainmenu-content">
                <div className="mainmenu-search">
                    <input type="text" placeholder="Search..."/>
                </div>
                <div className="mainmenu-invoices">
                    <InvoiceCard title='Нови фактури' items=''/>
                    <InvoiceCard title='Прегледани фактури' items=''/>
                </div>
            </div>
        </div>
    )
}

export default MainMenu;
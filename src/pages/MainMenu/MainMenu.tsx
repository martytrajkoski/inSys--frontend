import React, { useEffect, useState } from "react";
import MainMenuSidebar from "../../components/MainMenu/MainMenuSidebar";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";

const MainMenu: React.FC = () => {
    const [faktura, setFaktura] = useState<FakturaType[]>([])

    const fetchAllFakturas = async() => {
        try {
            const response = await axiosClient.get('/faktura/');

            if(response.status===201){
                setFaktura(response.data.documents)
            }

        } catch (error) {
            console.error(error);
        }
    }

    console.log('faktura', faktura)
    useEffect(()=>{
        fetchAllFakturas()
    }, [])

    return(
        <div className="mainmenu">
            <MainMenuSidebar/>
            <div className="mainmenu-content">
                <div className="mainmenu-search">
                    <input type="text" placeholder="Search..."/>
                </div>
                <div className="mainmenu-invoices">
                    <InvoiceCard title='Нови фактури' items={faktura}/>
                    <InvoiceCard title='Прегледани фактури' items={faktura}/>
                </div>
            </div>
        </div>
    )
}

export default MainMenu;
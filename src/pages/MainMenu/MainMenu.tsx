import React, { useEffect, useState } from "react";
import MainMenuSidebar from "../../components/MainMenu/MainMenuSidebar";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/primary-button/primary-button.scss";

const MainMenu: React.FC = () => {
  const [faktura, setFaktura] = useState<FakturaType[]>([]);

  const fetchAllFakturas = async () => {
    try {
      const response = await axiosClient.get("/faktura/");

      if (response.status === 201) {
        setFaktura(response.data.documents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("faktura", faktura);
  useEffect(() => {
    fetchAllFakturas();
  }, []);

  return (
    <div className="mainmenu">
      <MainMenuSidebar />
      <div className="mainmenu-content">
        <div className="mainmenu-search">
          <input type="search" placeholder="Пребарај фактура..." />
          <button>
            Пребарај&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="mainmenu-invoices">
          <InvoiceCard title="Нови фактури" items={faktura} />
          <InvoiceCard title="Прегледани фактури" items={faktura} />
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

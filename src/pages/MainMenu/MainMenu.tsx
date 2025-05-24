import React, { useEffect, useState } from "react";
import MainMenuSidebar from "../../components/MainMenu/MainMenuSidebar";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import "../../styles/components/mainmenu/search-bar.scss";

const MainMenu: React.FC = () => {
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const [search, setSearch] = useState("");
  const [filteredFaktura, setFilteredFaktura] = useState<FakturaType[]>([]);

  const fetchAllFakturas = async () => {
    try {
      const response = await axiosClient.get("/faktura/");
      if (response.status === 201) {
        setFaktura(response.data.documents);
        setFilteredFaktura(response.data.documents); // preload dropdown
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllFakturas();
  }, []);

  // onChange filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setFilteredFaktura(faktura);
    } else {
      const filtered = faktura.filter((item) =>
        item.br_faktura.toString().startsWith(value)
      );
      setFilteredFaktura(filtered);
    }
  };

  return (
    <div className="mainmenu">
      <MainMenuSidebar />
      <div className="mainmenu-content">
        <div className="mainmenu-search">
          <input
            type="search"
            placeholder="Пребарај фактура..."
            value={search}
            onChange={handleSearchChange}
          />
          {search.length > 0 && (
            <ul className="dropdown">
              {filteredFaktura.map((item) => (
                <li key={item.id}>{item.br_faktura}</li>
              ))}
              {filteredFaktura.length === 0 && <li>Нема резултати</li>}
            </ul>
          )}
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

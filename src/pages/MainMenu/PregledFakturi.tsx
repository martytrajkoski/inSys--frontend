import React, { useEffect, useState } from "react";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import "../../styles/components/mainmenu/search-bar.scss";
import "../../styles/pages/mainmenu/mainmenu.scss";
import { Link, useNavigate } from "react-router-dom";

const getRouteByRole = (role: string, br_faktura: number): string => {
  switch (role) {
    case "Продекан за финансии":
      return `/prodekan/${br_faktura}`;
    case "Технички секретар":
      return `/tehnickisekretar/${br_faktura}`;
    case "Јавна набавка":
      return `/tipnabavka/${br_faktura}`;
    case "Барател на набавка":
      return `/baratelnabavka/${br_faktura}`;
    case "Сметководство":
      return `/smetkovodstvo/${br_faktura}`;
    default:
      return "/";
  }
};

const PregledFakturi: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const [search, setSearch] = useState("");
  const [filteredFaktura, setFilteredFaktura] = useState<FakturaType[]>([]);
  const navigate = useNavigate();

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

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/auth/user");

      if (response.status === 201) {
        setRole(response.data.role.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllFakturas();
    fetchUser();
  }, []);

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
            {filteredFaktura.map((item) => {
              let isRead = false;

              switch (role) {
                case "Јавна набавка":
                  isRead = !!item.tip_nabavka?.read;
                  break;
                case "Барател на набавка":
                  isRead = !!item.baratel_javna_nabavka?.read;
                  break;
                case "Сметководство":
                  isRead = !!item.smetkovodstvo?.read;
                  break;
                case "Продекан за финансии":
                  isRead = item.approved_at !== null;
                  break;
                default:
                  isRead = false;
              }

              return (
                <li
                  onClick={() =>
                    navigate(getRouteByRole(role, item.br_faktura))
                  }
                  key={item.id}
                  className="dropdown-item"
                >
                  <span>{item.br_faktura}</span>
                  <span
                    className={`invoice-flag ${isRead ? "read" : "unread"}`}
                  >
                    {isRead ? "Прочитано" : "Непрочитано"}
                  </span>
                </li>
              );
            })}
            {filteredFaktura.length === 0 && <li>Нема резултати</li>}
          </ul>
        )}
      </div>
      {role == "Технички секретар" ? (
        <div className="mainmenu-invoices">
          <Link to="/tehnickisekretar">Креирај фактура</Link>
          <InvoiceCard title="Креирани фактури" items={faktura} role={role} />
        </div>
      ) : (
        <div className="mainmenu-invoices">
          <InvoiceCard title="Нови фактури" items={faktura} role={role} />
          <InvoiceCard title="Прегледани фактури" items={faktura} role={role} />
        </div>
      )}
    </div>
  );
};

export default PregledFakturi;

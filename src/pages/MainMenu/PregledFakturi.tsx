import React, { useEffect, useState } from "react";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import { useNavigate } from "react-router-dom";

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
  const [filterType, setFilterType] = useState<"Нови фактури" | "Прегледани фактури">("Нови фактури");

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
                  <span className={`invoice-flag ${isRead ? "read" : "unread"}`}>
                    {isRead ? "Прочитано" : "Непрочитано"}
                  </span>
                </li>
              );
            })}
            {filteredFaktura.length === 0 && <li>Нема резултати</li>}
          </ul>
        )}
      </div>

      {role === "Технички секретар" ? (
        <div className="mainmenu-invoices">
          <button onClick={() => navigate("/tehnickisekretar")}>Креирај фактура</button>
          <InvoiceCard title={filterType} items={faktura} role={role} />
        </div>
      ) : (
        <div className="mainmenu-invoices">
          <div className="invoice-filter-dropdown">
            <h1>{filterType}</h1>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "Нови фактури" | "Прегледани фактури")
              }
            >
              <option value="Нови фактури">Нови фактури</option>
              <option value="Прегледани фактури">Прегледани фактури</option>
            </select>
          </div>
          <InvoiceCard title={filterType} items={faktura} role={role} />
        </div>
      )}
    </div>
  );
};

export default PregledFakturi;

import React, { useEffect, useState } from "react";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

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
  const [search, setSearch] = useState("");
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const [fakturaLastPage, setFakturaLastPage] = useState<number>();
  const [fakturaCurrentPage, setFakturaCurrentPage] = useState<number>(1);
  const [filteredFaktura, setFilteredFaktura] = useState<FakturaType[]>([]);
  const [filterType, setFilterType] = useState<"Нови фактури" | "Прегледани фактури" | "Прифатени" | "Одбиени">("Нови фактури");

  const navigate = useNavigate();

  const fetchFakturas = async() => {
    if(filterType == "Нови фактури" || filterType == "Прегледани фактури"){
      console.log('filterType', filterType)
      try {
        const response = await axiosClient.post(`/faktura/read?page=${fakturaCurrentPage}`, {
          filter: filterType == "Нови фактури" ? ('not_read') : ('read')
        });
  
        if(response.status === 201){
          console.log('response.data.document.data', response.data.documents.data)
          setFaktura(response.data.documents.data)
          setFakturaLastPage(response.data.documents.last_page);
          setFakturaCurrentPage(response.data.documents.current_page);
        }
  
      } catch (error) {
        console.error(error);
      }

    } else {

      try {
        const response = await axiosClient.post(`/faktura/status?page=${fakturaCurrentPage}`, {
          status: filterType == "Одбиени" ? ('rejected') : ('approved')
        });
  
        if(response.status === 201){
          console.log('response.data.document.data', response.data.documents)
          setFaktura(response.data.documents.data)
          setFakturaLastPage(response.data.documents.last_page);
          setFakturaCurrentPage(response.data.documents.current_page);
        }
  
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);

    try {
      const response = await axiosClient.post('/faktura/search',{
        search: value
      })

      if(response.status === 201){
        setFilteredFaktura(response.data.documents)
      }
    } catch (error) {
      console.error(error);
    }
  }

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
    fetchFakturas();
    fetchUser();
  }, [fakturaCurrentPage, filterType]);



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
              return (
                <li
                  onClick={() =>
                    navigate(getRouteByRole(role, item.br_faktura))
                  }
                  key={item.id}
                  className="dropdown-item"
                >
                  <span>{item.br_faktura}</span>
                  <span className={`invoice-flag ${item.read ? "read" : "unread"}`}>
                    {item.read ? "Прочитано" : "Непрочитано"}
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
          <InvoiceCard items={faktura} role={role} />
          {fakturaLastPage && fakturaLastPage > 1 && (
            <Pagination
              currentPage={fakturaCurrentPage}
              lastPage={fakturaLastPage ?? 1}
              onPageChange={(page) => setFakturaCurrentPage(page)}
            />   
          )}
        </div>
      ) : (
        <div className="mainmenu-invoices">
          <div className="invoice-filter-dropdown">
            <h1>{filterType}</h1>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as | "Нови фактури" | "Прегледани фактури" | "Прифатени" | "Одбиени")}>
              <option value="Нови фактури">Нови фактури</option>
              <option value="Прегледани фактури">Прегледани фактури</option>
              {role !== "Продекан за финансии" && <option value="Прифатени">Прифатени</option>}
              {role !== "Продекан за финансии" && <option value="Одбиени">Одбиени</option>}
            </select>
          </div>
          <InvoiceCard items={faktura} role={role} />
          {fakturaLastPage && fakturaLastPage > 1 && (
            <Pagination
              currentPage={fakturaCurrentPage}
              lastPage={fakturaLastPage ?? 1}
              onPageChange={(page) => setFakturaCurrentPage(page)}
            />        
          )}
        </div>
      )}
    </div>
  );
};

export default PregledFakturi;

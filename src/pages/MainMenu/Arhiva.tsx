import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import Pagination from "../../components/Pagination/Pagination";
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

const Arhiva: React.FC = () => {
  const navigate = useNavigate();
  const [archiveFaktura, setArchiveFaktura] = useState<FakturaType[]>([]);
  const [fakturaLastPage, setFakturaLastPage] = useState<number>();
  const [fakturaCurrentPage, setFakturaCurrentPage] = useState<number>(1);
  const [filteredFaktura, setFilteredFaktura] = useState<FakturaType[]>([]);
  const [search, setSearch] = useState<string>("")
  const [role, setRole] = useState<string>("");
  const [sortYear, setSortYear] = useState<number>(new Date().getFullYear());
  const [selectSortYears, setSelectSortYears] = useState<number[]>([]);
  
  const fetchArhivedFakturas = async () => {
    try {
      const response = await axiosClient.get(`/faktura/archive/?year=${sortYear}&page=${fakturaCurrentPage}`);
      
      if (response.status === 201) {
        setSelectSortYears(response.data.years)
        setArchiveFaktura(response.data.documents.data || []);
        setFakturaLastPage(response.data.documents.last_page);
        setFakturaCurrentPage(response.data.documents.current_page);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);

    try {
      const response = await axiosClient.post('/faktura/searcharchive',{
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
    fetchArhivedFakturas();
    setFakturaCurrentPage(1);
  }, [sortYear, fakturaCurrentPage]);
  
  useEffect(() => {
    fetchUser();
  }, []);

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
                  <span>Број на фактура: {item.br_faktura}</span>
                </li>
              );
            })}
            {filteredFaktura.length === 0 && <li>Нема резултати</li>}
          </ul>
        )}
      </div>
      <div className="mainmenu-invoices">
        <h1>Архива</h1>
        <div className="archive-sort">
          <label>Сортирај по година: </label>
          <select
            value={sortYear}
            onChange={(e) => {
              setSortYear(Number(e.target.value));
            }}
          >
            {selectSortYears.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
        </div>
        <InvoiceCard items={archiveFaktura} role={role} />
        {fakturaLastPage && fakturaLastPage > 1 && (
          <Pagination
            currentPage={fakturaCurrentPage}
            lastPage={fakturaLastPage ?? 1}
            onPageChange={(page) => setFakturaCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default Arhiva;

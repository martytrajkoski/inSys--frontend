import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType, IzdavaciType } from "../../types/types";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import Pagination from "../../components/Pagination/Pagination";

const PregledFakturaFilter: React.FC = () => {
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const [fakturaLastPage, setFakturaLastPage] = useState<number>();
  const [fakturaCurrentPage, setFakturaCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<string>("");
  const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
  const [izdavacName, setIzdavacName] = useState<string>();
  const [selectedIzdavacId, setSelectedIzdavacId] = useState<string | undefined>(String(izdavaci[0]?.id));
  const [selectedTipId, setSelectedTipId] = useState<string>("");

  const fetchFakturas = async (id: string | undefined, tip: string) => {
    try {
      const response = await axiosClient.post(`/faktura/filter?page=${fakturaCurrentPage}`, {
        izdavac: id,
        tip: tip,
      });

      if (response.status === 201) {
        setFaktura(response.data.documents.data || []);
        setFakturaLastPage(response.data.documents.last_page);
        setFakturaCurrentPage(response.data.documents.current_page);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log('izdavaci[0]', izdavaci[0])
  const fetchIzdavaci = async () => {
    try {
      const response = await axiosClient.get("/izdavaci");
      if (response.status === 201) {
        setIzdavaci(response.data);
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
    fetchUser();
    fetchIzdavaci();
  }, []);

  useEffect(() => {
    if (selectedIzdavacId) {
      fetchFakturas(selectedIzdavacId, selectedTipId);
      const match = izdavaci.find((i) => String(i.id) === selectedIzdavacId);
      setIzdavacName(match?.name ?? "");
    }
  }, [selectedIzdavacId, selectedTipId, fakturaCurrentPage]);

  return (
    <div className="mainmenu-content">
      <div className="mainmenu-invoices">
        <h1>
          {izdavacName
            ? `Преглед на фактури по издавач: ${izdavacName}`
            : "Изберете издавач за да ги прикажете фактурите"}
        </h1>

        <div className="mainmenu-filters">
          <div className="archive-sort">
            <label>Сортирај по издавач: </label>
            <select
              value={selectedIzdavacId ?? ""}
              onChange={(e) => {
                setSelectedIzdavacId(e.target.value);
                setFakturaCurrentPage(1);
              }}
            >
              <option value="">
                -- Изберете издавач --
              </option>
              {izdavaci.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="archive-sort">
            <label>Сортирај по тип: </label>
            <select
              value={selectedTipId}
              onChange={(e) => {
                setSelectedTipId(e.target.value);
                setFakturaCurrentPage(1);
              }}
            >
              <option value="">-- Сите типови --</option>
              <option value="javna">Јавна Набавка</option>
              <option value="tender">Набавка Без Тендер</option>
            </select>
          </div>
        </div>
        {selectedIzdavacId && (
          <>
            <InvoiceCard items={faktura} role={role} />
            {fakturaLastPage && fakturaLastPage > 1 && (
              <Pagination
                currentPage={fakturaCurrentPage}
                lastPage={fakturaLastPage}
                onPageChange={(page) => setFakturaCurrentPage(page)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PregledFakturaFilter;

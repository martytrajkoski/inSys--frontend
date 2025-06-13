import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType, IzdavaciType } from "../../types/types";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import Pagination from "../../components/Pagination/Pagination";

const PregledFakturaIzdavaci: React.FC = () => {
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const [fakturaLastPage, setFakturaLastPage] = useState<number>();
  const [fakturaCurrentPage, setFakturaCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<string>("");
  const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
  const [izdavacName, setIzdavacName] = useState<string>();
  const [selectedIzdavacId, setSelectedIzdavacId] = useState<string | undefined>(String(izdavaci[0]?.id));

  const fetchFakturas = async (id: string | null) => {
    try {
      const response = await axiosClient.post(`/faktura/izdavaci?page=${fakturaCurrentPage}`, {
        izdavac: id,
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

  const fetchIzdavaci = async () => {
    try {
      const response = await axiosClient.get("/izdavaci/");
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
      fetchFakturas(selectedIzdavacId);
      const match = izdavaci.find((i) => String(i.id) === selectedIzdavacId);
      setIzdavacName(match?.name ?? "");
    }
  }, [selectedIzdavacId, fakturaCurrentPage]);

  return (
    <div className="mainmenu-content">
      <div className="mainmenu-invoices">
        <h1>
          {izdavacName
            ? `Преглед на фактури по издавач: ${izdavacName}`
            : "Изберете издавач за да ги прикажете фактурите"}
        </h1>

        <div className="archive-sort">
          <label>Сортирај по издавач: </label>
          <select
            value={selectedIzdavacId ?? ""}
            onChange={(e) => {
              setSelectedIzdavacId(e.target.value);
              setFakturaCurrentPage(1); // reset to page 1 when switching
            }}
          >
            <option value="" disabled>
              -- Изберете издавач --
            </option>
            {izdavaci.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
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

export default PregledFakturaIzdavaci;

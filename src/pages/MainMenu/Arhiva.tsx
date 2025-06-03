import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import Pagination from "../../components/Pagination/Pagination";

const Arhiva: React.FC = () => {
  const [archiveFaktura, setArchiveFaktura] = useState<FakturaType[]>([]);
  const [fakturaLastPage, setFakturaLastPage] = useState<number>();
  const [fakturaCurrentPage, setFakturaCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<string>("");

  const fetchFakturas = async () => {
    try {
      const response = await axiosClient.get(`/faktura/archive/?page=${fakturaCurrentPage}`);

      if (response.status === 201) {
        setArchiveFaktura(response.data.documents.data);
        setFakturaLastPage(response.data.documents.last_page);
        setFakturaCurrentPage(response.data.documents.current_page);
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
    fetchFakturas();
    fetchUser();
  }, []);

  return (
    <div className="mainmenu-content">
      <div className="mainmenu-invoices">
        <h1>Архива</h1>
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

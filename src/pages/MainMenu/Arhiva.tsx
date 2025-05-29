import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";

const Arhiva: React.FC = () => {
    const [archiveFaktura, setArchiveFaktura] = useState<FakturaType[]>([]);
    const [role, setRole] = useState<string>("");
    
    const fetchFakturas = async () => {
        try {
            const response = await axiosClient.get('/faktura/');

            if (response.status === 201) {

                const sealedFakturas = response.data.documents.filter(
                    (faktura: FakturaType) => faktura.is_sealed === 1
                );

                setArchiveFaktura(sealedFakturas);
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

    return(
        <div className="mainmenu-content">
      {/* <div className="mainmenu-search">
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
      </div> */}
    <div className="mainmenu-invoices">
        <InvoiceCard title={""} items={archiveFaktura} role={role} />   
    </div>
    </div>
    )
}

export default Arhiva;
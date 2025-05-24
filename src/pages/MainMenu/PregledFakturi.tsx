import React, { useEffect, useState } from "react";
import InvoiceCard from "../../components/MainMenu/InvoiceCard";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PregledFakturi: React.FC = () => {

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

    useEffect(() => {
        fetchAllFakturas();
    }, []);

    return (
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
    )
}

export default PregledFakturi;
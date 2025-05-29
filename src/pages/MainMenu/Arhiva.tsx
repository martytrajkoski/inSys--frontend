import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { FakturaType } from "../../types/types";

const Arhiva: React.FC = () => {
    const [archiveFaktura, setArchiveFaktura] = useState<FakturaType[]>([]);
    
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


    useEffect(() => {
        fetchFakturas();
    }, []);
    console.log('archiveFaktura', archiveFaktura);

    return(
        <div className=""></div>
    )
}

export default Arhiva;
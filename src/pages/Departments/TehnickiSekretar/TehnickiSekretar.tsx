import React, { useEffect, useState } from "react";
import ImportFile from "../../../components/ImportFile/ImportFile";
import axiosClient from "../../../axiosClient/axiosClient";
import type { IzdavaciType } from "../../../types/types";

const TehnickiSekretar: React.FC = () => {
    const [openImportModal, setopenImportModal] = useState<boolean>(false);
    const [arhivski_br, setArhivski_br] = useState<string>('');
    const [br_faktura, setBr_faktura] = useState<number>();
    const [br_dogovor, setBr_dogovor] = useState<number>();
    const [izdavaci_id, setIzdavaci_id] = useState<number>();
    const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
    const [iznos_dogovor, setIznos_dogovor] = useState<number>();
    const [vk_vrednost, setVk_vrednost] = useState<number>();
    const [datum, setDatum] = useState<string>('');
    const [scan_file, setScan_file] = useState<string>('dqwdq');

    const [created, setCreated] = useState<boolean>();
    const [documentId, setDocumentId] = useState<number>();

    const handleImportModal = () => {
        setopenImportModal(!openImportModal);
    }

    const storeTehnicki = async(e:any) =>{
        e.preventDefault()

        try {
            const response = await axiosClient.post('/tehnickisekretar/addDocument',{
                "arhivski_br": arhivski_br,
                "br_faktura": br_faktura,
                "br_dogovor": br_dogovor,
                "izdavaci_id": izdavaci_id, 
                "iznos_dogovor": iznos_dogovor,
                "vk_vrednost": vk_vrednost,
                "datum": datum,
                "scan_file": scan_file
            })

            if(response.status === 201){
                console.log('Tehnicki Sekretar and Faktuta created')  
                setDocumentId(response.data.document.id)
                setCreated(true);
            }


        } catch (error) {
            console.error(error);
        }
    }

    const updateTehnicki = async(e: any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.patch(`/tehnickisekretar/updateDocument/${documentId}`,{
                "arhivski_br": arhivski_br,
                "br_faktura": br_faktura,
                "br_dogovor": br_dogovor,
                "izdavaci_id": izdavaci_id, 
                "iznos_dogovor": iznos_dogovor,
                "vk_vrednost": vk_vrednost,
                "datum": datum,
                "scan_file": scan_file
            });

            if(response.status === 201){
                console.log('Tehnicki Sekretar and Faktura updated successfully');
            }

        } catch (error) {
            console.error(error);
        }
    }
    
    const deleteTehnicki = async(e: any) =>{
        e.preventDefault();
        try {
            const response = await axiosClient.delete(`/tehnickisekretar/destroy/${documentId}`);

            if(response.status === 201){
                console.log('Tehnicki Sekretar and Faktuta deleted')    
                
                setArhivski_br('');
                setBr_faktura(0);
                setBr_dogovor(0);
                setIzdavaci_id(0);
                setIznos_dogovor(0);
                setVk_vrednost(0);
                setDatum('');
                setScan_file('');
                setCreated(false);
                setDocumentId(0);
            }


        } catch (error) {
            console.error(error);
        }
    }

    const fetchIzdavaci = async() => {
        try {
            const response = await axiosClient.get('/izdavaci/');

            if(response.status===200){
                setIzdavaci(response.data);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchIzdavaci();
    }, [])

    return(
        <>
            <h3>Основни информации</h3>
            <form onSubmit={storeTehnicki}>
                <div className="form-item">
                    <div className="form-item-inputs">
                        <input type="text" value={arhivski_br} placeholder="Архивски број на влезна фактура 05-12-" onChange={(e)=>setArhivski_br(e.target.value)}/>
                        <input type="number" value={br_faktura} placeholder="Број на фактура" onChange={(e) => setBr_faktura(Number(e.target.value))}/>
                        <input type="number" value={br_dogovor} placeholder="Број на договор" onChange={(e) => setBr_dogovor(Number(e.target.value))}/>
                        <input type="number" value={iznos_dogovor} placeholder="Износ на фактура" onChange={(e) => setIznos_dogovor(Number(e.target.value))}/>
                        <input type="date" value={datum} placeholder="Датум" onChange={(e) => setDatum(e.target.value)}/>
                        <select value={izdavaci_id ?? ''} onChange={(e) => setIzdavaci_id(Number(e.target.value))}>
                            <option value="">Избери издавач</option>
                            {izdavaci.map((item) => (
                                <option key={item.id} value={item.id}>
                                {item.name}
                                </option>
                            ))}
                        </select>
                        <input type="number" value={vk_vrednost} placeholder="Вкупна вредност на фактура (со ДДВ)" onChange={(e) => setVk_vrednost(Number(e.target.value))}/>
                    </div>
                    <div className="form-buttons">
                        <div className="form-button-scan">
                            <button onClick={(e) => {e.preventDefault(); handleImportModal();}}>Скенирај фактура</button>
                            <span>Document.txt</span>
                        </div>
                        <div className="form-buttons-edit">
                            {!created ? (
                                <button type="submit">Save</button>
                            ) : (
                                <button onClick={updateTehnicki}>Edit</button>
                            )}
                            {created && (
                                <button onClick={deleteTehnicki}>Delete</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            {openImportModal && (
                <ImportFile onClose={handleImportModal}/>
            )}
        </>
    )
}

export default TehnickiSekretar;
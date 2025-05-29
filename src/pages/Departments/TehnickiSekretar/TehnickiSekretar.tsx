import React, { useEffect, useState } from "react";
import ImportFile from "../../../components/ImportFile/ImportFile";
import axiosClient from "../../../axiosClient/axiosClient";
import type { IzdavaciType } from "../../../types/types";
import { useNavigate, useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";

const TehnickiSekretar: React.FC = () => {
    const { br_faktura } = useParams<string>();

    const [openImportModal, setopenImportModal] = useState<boolean>(false);
    const [arhivski_br, setArhivski_br] = useState<string>('');
    const [br_fakturaa, setBr_fakturaa] = useState<number>();
    const [br_dogovor, setBr_dogovor] = useState<number>();
    const [izdavaci_id, setIzdavaci_id] = useState<number>();
    const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
    const [iznos_dogovor, setIznos_dogovor] = useState<number>();
    const [vk_vrednost, setVk_vrednost] = useState<number>();
    const [datum, setDatum] = useState<string>('');
    const [review_comment, setReview_comment] = useState<string>();
    const [status, setStatus] = useState<string>("pending");
    const [scan_file, setScan_file] = useState<string>('dqwdq');

    const [created, setCreated] = useState<boolean>();
    const [documentId, setDocumentId] = useState<number>();

    const navigate = useNavigate();

    const handleImportModal = () => {
        setopenImportModal(!openImportModal);
    }

    const fetchTehnicki = async() => {
        try {
            const response = await axiosClient.get(`/tehnickisekretar/show/${br_faktura}`)

            if(response.status === 201){
                setDocumentId(response.data.document.id);
                setArhivski_br(response.data.document.arhivski_br);
                setBr_fakturaa(response.data.document.br_faktura);
                setBr_dogovor(response.data.document.br_dogovor);
                setIzdavaci_id(response.data.document.izdavaci_id);
                setIznos_dogovor(response.data.document.iznos_dogovor);
                setVk_vrednost(response.data.document.vk_vrednost);
                setDatum(response.data.document.datum);
                setScan_file(response.data.document.scan_file);
                setReview_comment(response.data.document.review_comment);
                setStatus(response.data.document.status)
                setCreated(true);
            }
            else if(response.status === 404){
                setArhivski_br('');
                setBr_fakturaa(undefined);
                setBr_dogovor(undefined);
                setIzdavaci_id(undefined);
                setIznos_dogovor(undefined);
                setVk_vrednost(undefined);
                setDatum('');
                setScan_file('');
                setDocumentId(undefined);
                setCreated(false);
                setReview_comment('');
            }

        } catch (error) {
            console.error(error);
        }
    }

    const storeTehnicki = async(e:any) =>{
        e.preventDefault()

        try {
            const response = await axiosClient.post('/tehnickisekretar/addDocument',{
                "arhivski_br": arhivski_br,
                "br_faktura": br_fakturaa,
                "br_dogovor": br_dogovor,
                "izdavaci_id": izdavaci_id, 
                "iznos_dogovor": iznos_dogovor,
                "vk_vrednost": vk_vrednost,
                "datum": datum,
                "scan_file": scan_file
            })

            if(response.status === 201){
                console.log('Tehnicki Sekretar and Faktuta created')
                navigate('/');  
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
                "br_faktura": br_fakturaa,
                "br_dogovor": br_dogovor,
                "izdavaci_id": izdavaci_id, 
                "iznos_dogovor": iznos_dogovor,
                "vk_vrednost": vk_vrednost,
                "datum": datum,
                "scan_file": scan_file,
            });

            if(response.status === 201){
                setStatus('pending');
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
                setBr_fakturaa(0);
                setBr_dogovor(0);
                setIzdavaci_id(0);
                setIznos_dogovor(0);
                setVk_vrednost(0);
                setDatum('');
                setScan_file('');
                setCreated(false);
                setDocumentId(0);

                navigate('/')
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
        fetchTehnicki();
    }, [status])

    return(
        <>
            <h3>Основни информации</h3>
            <form onSubmit={storeTehnicki}>
                <div className="form-item">
                    <div className="form-item-inputs">
                        <input type="text" value={arhivski_br} placeholder="Архивски број на влезна фактура 05-12-" onChange={(e)=>setArhivski_br(e.target.value)}/>
                        <input type="number" value={br_fakturaa} placeholder="Број на фактура" onChange={(e) => setBr_fakturaa(Number(e.target.value))}/>
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
                    {status !== "pending" ? (
                        <CommentSectionRead review_comment={review_comment || ''} status={status || 'pending'}/>
                    ):(
                        <div></div>
                    )}
                </div>
            </form>
            {openImportModal && (
                <ImportFile onClose={handleImportModal}/>
            )}
        </>
    )
}

export default TehnickiSekretar;
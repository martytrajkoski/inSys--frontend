import React, { useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";

const Smetkovodstvo:React.FC = () => {
    const { br_faktura } = useParams<string>();
    const [brKarton, setBrKarton] = useState<number>();
    const [sostojbaKarton, setSostojbaKarton] = useState<string>("");
    const [osnovaEvidentiranje, setOsnovaEvidentiranje] = useState<boolean>();
    const [formular, setFormular] = useState<boolean>();
    const [vneseniSredstva, setVneseniSredstva] = useState<boolean>();
    const [smetka, setSmetka] = useState<string>("");
    const [konto, setKonto] = useState<string>("");
    const [datum, setDatum] = useState<string>("");

    const [documentId, setDocumentId] = useState<number>();
    const [created, setCreated] = useState<boolean>();

    const storeSmetkovodstvo = async(e:any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/smetkovodstvo/addDocument',{
                br_karton: brKarton,
                br_faktura: parseInt(br_faktura || "0", 10),
                sostojba_karton: sostojbaKarton,
                osnova_evidentiranje: osnovaEvidentiranje,
                formular: formular,
                vneseni_sredstva: vneseniSredstva,
                smetka: smetka,
                konto: konto,
                datum: datum,
                read: true
            })

            if(response.status === 201){
                console.log('Smetkovodstvo stored');
                setCreated(true);
                setDocumentId(response.data.document.id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateSmetkovodstvo = async(e:any) => {
        e.preventDefault()

        try {
            const response = await axiosClient.patch(`/smetkovodstvo/updateDocument/${documentId}`,{
                br_karton: brKarton,
                br_faktura: parseInt(br_faktura || "0", 10),
                sostojba_karton: sostojbaKarton,
                osnova_evidentiranje: osnovaEvidentiranje,
                formular: formular,
                vneseni_sredstva: vneseniSredstva,
                smetka: smetka,
                konto: konto,
                datum: datum
            });

            if(response.status === 201){
                console.log('Smetkovodstvo updated');
            }

        } catch (error) {
            console.error(error);   
        }
    }

    const deleteSmetkovodstvo = async(e:any) =>{
        e.preventDefault()
        
        try {
            const response = await axiosClient.delete(`/smetkovodstvo/destroy/${documentId}`)

            if(response.status === 201){
                console.log('Smetkovodstvo deleted');
                
                setBrKarton(0);
                setSostojbaKarton('');
                setOsnovaEvidentiranje(undefined);
                setFormular(undefined);
                setVneseniSredstva(undefined);
                setSmetka('');
                setKonto('');
                setDatum('');
                setCreated(false);
            }
        } catch (error) {
            console.error(error);   
        }
    }

    return(
        <>
            <form onSubmit={storeSmetkovodstvo}>
                <div className="form-item">
                    <h3>Информации од сметководство</h3>
                    <div className="form-item-inputs">
                        <input
                            type="number"
                            placeholder="Број на картон (Конто)"
                            value={brKarton}
                            onChange={(e) => setBrKarton(Number(e.target.value))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Состојба на картон"
                            value={sostojbaKarton}
                            onChange={(e) => setSostojbaKarton(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-item-radio">
                        <p>Основa за евидентирање:</p>
                        <div className="form-radio">
                            <label>
                                <input type="radio" name="osnova" onChange={() => setOsnovaEvidentiranje(true)} />
                                Да
                            </label>
                            <label>
                                <input type="radio" name="osnova" onChange={() => setOsnovaEvidentiranje(false)} />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Пополнет формулар:</p>
                        <div className="form-radio">
                            <label>
                                <input type="radio" name="formular" onChange={() => setFormular(true)} />
                                Да
                            </label>
                            <label>
                                <input type="radio" name="formular" onChange={() => setFormular(false)} />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Средства внесени:</p>
                        <div className="form-radio">
                            <label>
                                <input type="radio" name="sredstva" onChange={() => setVneseniSredstva(true)} />
                                Да
                            </label>
                            <label>
                                <input type="radio" name="sredstva" onChange={() => setVneseniSredstva(false)} />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Предлог сметка за наплата од:</p>
                        <div className="form-radio">
                            <label>
                                <input type="radio" name="smetka" onChange={() => setSmetka("603")} />
                                603
                            </label>
                            <label>
                                <input type="radio" name="smetka" onChange={() => setSmetka("788")} />
                                788
                            </label>
                        </div>
                    </div>

                    <div className="form-item-inputs">
                        <input
                            type="text"
                            placeholder="Предлог конто за наплата до:"
                            value={konto}
                            onChange={(e) => setKonto(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Датум"
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <div></div>
                       <div className="form-buttons-edit">
                            {!created ? (
                                <button type="submit">Save</button>
                            ) : (
                                <button onClick={updateSmetkovodstvo}>Edit</button>
                            )}
                            {created && (
                                <button onClick={deleteSmetkovodstvo}>Delete</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    )   
}

export default Smetkovodstvo;
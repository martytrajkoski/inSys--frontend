import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";

const Smetkovodstvo: React.FC = () => {
    const { br_faktura } = useParams<string>();
    const [brKarton, setBrKarton] = useState<number>();
    const [sostojbaKarton, setSostojbaKarton] = useState<string>("");
    const [osnovaEvidentiranje, setOsnovaEvidentiranje] = useState<number>();
    const [formular, setFormular] = useState<number>();
    const [vneseniSredstva, setVneseniSredstva] = useState<number>();
    const [smetka, setSmetka] = useState<string>("");
    const [konto, setKonto] = useState<string>("");
    const [datum, setDatum] = useState<string>("");
    const [review_comment, setReview_comment] = useState<string>();
    const [status, setStatus] = useState<string>("pending");

    const [documentId, setDocumentId] = useState<number>();
    const [created, setCreated] = useState<boolean>();

    useEffect(() => {
        showSmetkovodstvo();
    }, []);

    const showSmetkovodstvo = async () => {
        try {
            const response = await axiosClient.get(
                `/smetkovodstvo/show/${br_faktura}`
            );

            if (response.status === 201) {
                setDocumentId(response.data.document.id);
                setBrKarton(response.data.document.br_karton);
                setSostojbaKarton(response.data.document.sostojba_karton);
                setOsnovaEvidentiranje(response.data.document.osnova_evidentiranje);
                setFormular(response.data.document.formular);
                setVneseniSredstva(response.data.document.vneseni_sredstva);
                setSmetka(response.data.document.smetka);
                setKonto(response.data.document.konto);
                setDatum(response.data.document.datum);
                setStatus(response.data.document.status);
                setReview_comment(response.data.document.review_comment);
                setCreated(true);
            } else if (response.status === 404) {
                setBrKarton(undefined);
                setSostojbaKarton("");
                setOsnovaEvidentiranje(undefined);
                setFormular(undefined);
                setVneseniSredstva(undefined);
                setSmetka("");
                setKonto("");
                setDatum("");
                setCreated(false);
                setReview_comment('');
            }

        } catch (error) {
            console.error(error);
        }
    };

    const storeSmetkovodstvo = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post("/smetkovodstvo/addDocument", {
                br_karton: brKarton,
                br_faktura: parseInt(br_faktura || "0", 10),
                sostojba_karton: sostojbaKarton,
                osnova_evidentiranje: osnovaEvidentiranje,
                formular: formular,
                vneseni_sredstva: vneseniSredstva,
                smetka: smetka,
                konto: konto,
                datum: datum,
                read: true,
            });

            if (response.status === 201) {
                console.log("Smetkovodstvo stored");
                setCreated(true);
                setDocumentId(response.data.document.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateSmetkovodstvo = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.patch(
                `/smetkovodstvo/updateDocument/${documentId}`,
                {
                    br_karton: brKarton,
                    br_faktura: parseInt(br_faktura || "0", 10),
                    sostojba_karton: sostojbaKarton,
                    osnova_evidentiranje: osnovaEvidentiranje,
                    formular: formular,
                    vneseni_sredstva: vneseniSredstva,
                    smetka: smetka,
                    konto: konto,
                    datum: datum,
                }
            );

            if (response.status === 201) {
                setStatus('pending');
                console.log("Smetkovodstvo updated");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteSmetkovodstvo = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.delete(
                `/smetkovodstvo/destroy/${documentId}`
            );

            if (response.status === 201) {
                console.log("Smetkovodstvo deleted");

                setBrKarton(0);
                setSostojbaKarton("");
                setOsnovaEvidentiranje(undefined);
                setFormular(undefined);
                setVneseniSredstva(undefined);
                setSmetka("");
                setKonto("");
                setDatum("");
                setCreated(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
                                <input
                                    type="radio"
                                    name="osnova"
                                    checked={osnovaEvidentiranje === 1}
                                    onChange={() => setOsnovaEvidentiranje(1)}
                                />
                                Да
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="osnova"
                                    checked={osnovaEvidentiranje === 0}
                                    onChange={() => setOsnovaEvidentiranje(0)}
                                />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Пополнет формулар:</p>
                        <div className="form-radio">
                            <label>
                                <input
                                    type="radio"
                                    name="formular"
                                    checked={formular === 1}
                                    onChange={() => setFormular(1)}
                                />
                                Да
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="formular"
                                    checked={formular === 0}
                                    onChange={() => setFormular(0)}
                                />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Средства внесени:</p>
                        <div className="form-radio">
                            <label>
                                <input
                                    type="radio"
                                    name="sredstva"
                                    checked={vneseniSredstva === 1}
                                    onChange={() => setVneseniSredstva(1)}
                                />
                                Да
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="sredstva"
                                    checked={vneseniSredstva === 0}
                                    onChange={() => setVneseniSredstva(0)}
                                />
                                Не
                            </label>
                        </div>
                    </div>

                    <div className="form-item-radio">
                        <p>Предлог сметка за наплата од:</p>
                        <div className="form-radio">
                            <label>
                                <input
                                    type="radio"
                                    name="smetka"
                                    checked={smetka === "603"}
                                    onChange={() => setSmetka("603")}
                                />
                                603
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="smetka"
                                    checked={smetka === "788"}
                                    onChange={() => setSmetka("788")}
                                />
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
                            {created && <button onClick={deleteSmetkovodstvo}>Delete</button>}
                        </div>
                    </div>

                    {status !== "pending" ? (
                        <CommentSectionRead review_comment={review_comment || ''} status={status || 'pending'}/>
                    ):(
                        <div></div>
                    )}
                </div>
            </form>
        </>
    );
};

export default Smetkovodstvo;

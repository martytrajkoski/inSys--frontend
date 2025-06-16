import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";


const TipNabavka: React.FC = () => {
  const { br_faktura } = useParams<string>();
  const [is_sealed, setIs_sealed] = useState<number>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  //TIP
  const [tip, setTip] = useState<string>("javna");
  const [datum, setDatum] = useState<string>();
  const [review_comment, setReview_comment] = useState<string>();
  const [status, setStatus] = useState<string>("pending");

  const [brDogovor, setBrDogovor] = useState<string>();
  const [vk_vrednost, setVk_vrednost] = useState<number>();
  const [vaznostDo, setVaznostDo] = useState<string>();
  const [soglasnoDogovor, setSoglasnoDogovor] = useState<number>();
  const [ostanatiRaspSredstva, setOstanatiRaspSredstva] = useState<number>();

  const [istTip, setIstTip] = useState<number>();
  const [vkPotroseno, setVkPotroseno] = useState<number>();

  const [created, setCreated] = useState<boolean>();
  const [documentId, setDocumentId] = useState<number>();

  //EVIDENCIJA

  const [brKarton, setBrKarton] = useState<number>();
  const [nazivProekt, setNazivProekt] = useState<string>("");
  const [poteklo, setPoteklo] = useState<string>("");
  const [baratel, setBaratel] = useState<string>();

  useEffect(() => {
    showTipNabavka();
    showBaratel();
  }, []);

  const showTipNabavka = async () => {
    try {
      const response = await axiosClient.get(`/tipnabavka/show/${br_faktura}`);

      if (response.status === 201) {
        const doc = response.data.document;
        setIs_sealed(response.data.is_sealed ?? 0);
        setTip(doc.tip);
        setDatum(doc.datum);
        setReview_comment(doc.review_comment);
        setStatus(doc.status);
        setDocumentId(doc.id);

        if (doc.tip === "javna") {
          setBrDogovor(doc.javna_nabavka.br_dogovor);
          setVk_vrednost(doc.javna_nabavka.vk_vrednost ?? undefined);
          setVaznostDo(doc.javna_nabavka.vaznost_do);
          setSoglasnoDogovor(doc.javna_nabavka.soglasno_dogovor);
          setOstanatiRaspSredstva(doc.javna_nabavka.ostanati_rasp_sredstva);
        } else if (doc.tip === "tender") {
          setIstTip(doc.tender.ist_tip);
          setVkPotroseno(doc.tender.vk_potroseno);
        }

        setCreated(true);
      } else if (response.status === 404) {
        setIs_sealed(0);
        setTip("javna");
        setDatum(undefined);
        setBrDogovor("");
        setVk_vrednost(undefined);
        setVaznostDo(undefined);
        setSoglasnoDogovor(undefined);
        setOstanatiRaspSredstva(undefined);
        setIstTip(undefined);
        setVkPotroseno(undefined);
        setReview_comment("");
        setCreated(false);
      }
    } catch (error) {
      console.error(error);
      setIs_sealed(0); 
      setCreated(false);
    }
  };

  const storeTipNabavka = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/tipnabavka/addDocument", {
        br_faktura: br_faktura || "0",
        tip: tip,
        read: true,
        datum: datum,

        br_dogovor: brDogovor,
        vk_vrednost: vk_vrednost,
        vaznost_do: vaznostDo,
        ostanati_rasp_sredstva: ostanatiRaspSredstva,
        soglasno_dogovor: soglasnoDogovor,

        ist_tip: istTip,
        vk_potroseno: vkPotroseno,
      });

      if (response.status === 201) {
        console.log("Tip Nabavka created");
        setCreated(true);
        setDocumentId(response.data.document[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTipNabavka = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.patch(
        `/tipnabavka/updateTip/${documentId}`,
        {
          br_faktura: br_faktura || "0",
          tip: tip,
          read: true,
          datum: datum,

          br_dogovor: brDogovor,
          vk_vrednost: vk_vrednost,
          vaznost_do: vaznostDo,
          ostanati_rasp_sredstva: ostanatiRaspSredstva,
          soglasno_dogovor: soglasnoDogovor,

          ist_tip: istTip,
          vk_potroseno: vkPotroseno,
        }
      );

      if (response.status === 201) {
        setStatus("pending");
        setShowUpdateModal(true);
        console.log("TipNabavka is updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTipNabavka = async () => {
    try {
      const responseTip = await axiosClient.delete(
        `/tipnabavka/destroy/${documentId}`
      );

      if (responseTip.status === 201) {
        console.log("Tip nabavka is deleted");

        setCreated(false);
        setTip("");
        setDatum("");
        setBrDogovor("");
        setVk_vrednost(undefined);
        setVaznostDo("");
        setSoglasnoDogovor(undefined);
        setOstanatiRaspSredstva(undefined);
        setIstTip(undefined);
        setVkPotroseno(undefined);
        setDocumentId(undefined);

        setShowDeleteModal(false);
      }

       const responseBaratel = await axiosClient.delete(
        `/baratelnabavka/destroy/${documentId}`
      );

      if (responseBaratel.status === 201) {
        setDocumentId(undefined);
        setCreated(false);
        setBaratel("");
        setBrKarton(0);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");

        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error(error);
    }

    try {
     
    } catch (error) {
      console.error(error);
    }
  };

  
  const showBaratel = async () => {
    try {
      const response = await axiosClient.get(
        `/baratelnabavka/show/${br_faktura}`
      );
      
      if (response.status === 201) {
        setIs_sealed(response.data.is_sealed);
        setDocumentId(response.data.document.id);
        setBrKarton(response.data.document.br_karton);
        setNazivProekt(response.data.document.naziv_proekt);
        setPoteklo(response.data.document.poteklo);
        setDatum(response.data.document.datum);
        setBaratel(response.data.document.baratel);
        setReview_comment(response.data.document.review_comment);
        setStatus(response.data.document.status);
        setCreated(true);
      } else if (response.status === 404) {
        setBrKarton(undefined);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");
        setBaratel("");
        setCreated(false);
        setReview_comment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storeBaratelNabavka = async (e: any) => {
    e.preventDefault();
    
    try {
      const response = await axiosClient.post("/baratelnabavka/addDocument", {
        br_faktura: br_faktura || "0",
        br_karton: brKarton,
        naziv_proekt: nazivProekt,
        poteklo,
        datum,
        baratel: baratel,
        read: true,
      });

      if (response.status === 201) {
        console.log("BaratelNabavka stored");
        setDocumentId(response.data.document.id);
        setCreated(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateBaratelNabavka = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.patch(
        `/baratelnabavka/updateDocument/${documentId}`,
        {
          br_faktura: br_faktura || "0",
          br_karton: brKarton,
          naziv_proekt: nazivProekt,
          poteklo,
          datum,
          baratel: baratel,
        }
      );

      if (response.status == 201) {
        setStatus("pending");
        setShowUpdateModal(true);
        console.log("BaratelNabavka is updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <form onSubmit={(e) => {e.preventDefault();
        if (!created) {
          storeTipNabavka(e);
          storeBaratelNabavka(e);
        } else {
          updateTipNabavka(e);
          updateBaratelNabavka(e);
        }
      }}>
        <div className="form-item">
          <h1>Информации за тип на набавка </h1>
          <div className="form-item-select">
            <label>Содржината на фактурата, предметот на наплата е согласно:</label>
            <select value={tip} disabled={Boolean(is_sealed)} onChange={(e) => setTip(e.target.value)}>
              <option value="javna">Јавна набавка</option>
              <option value="tender">Набавка без тендер</option>
            </select>
          </div>
        </div>
        {tip === "javna" && (
          <div className="form-item">
            <div className="form-item-inputs">
              <label>Број на договор</label>
              <input
                type="text"
                value={brDogovor}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setBrDogovor(e.target.value)}
                required
              />
              <label>Важност на договор до</label>
              <input
                type="date"
                value={vaznostDo}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setVaznostDo(e.target.value)}
                required
              />
              <label>Вкупна вредност на фактура (со ДДВ)</label>
              <input
                type="number"
                value={vk_vrednost}
                placeholder="0"
                onChange={(e) => setVk_vrednost(Number(e.target.value))}
              />
              <label>Останати расположливи средства по договорот (без вредност на фактура)</label>
              <input
                type="number"
                placeholder="0"
                value={ostanatiRaspSredstva}
                readOnly={Boolean(is_sealed)}
                onChange={(e) =>
                  setOstanatiRaspSredstva(Number(e.target.value))
                }
                required
              />
            </div>
            <div className="form-item-radio">
              <label>
                Описот на сите ставки и единечната цена во фактурата е согласно
                договорот:
              </label>

              <div className="form-radio">
                <div>
                  <input
                    type="radio"
                    name="edinecna_cena"
                    checked={soglasnoDogovor === 1}
                    disabled={Boolean(is_sealed)}
                    onChange={() => setSoglasnoDogovor(1)}
                    required
                  />
                  <label>Да</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="edinecna_cena"
                    checked={soglasnoDogovor === 0}
                    disabled={Boolean(is_sealed)}
                    onChange={() => setSoglasnoDogovor(0)}
                    required
                  />
                  <label>Не</label>
                </div>
              </div>
            </div>
            <div className="form-item-inputs">
              <label>Датум</label>
              <input
                type="date"
                value={datum}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setDatum(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {tip === "tender" && (
          <div className="form-item">
            <div className="form-item-radio">
              <label>Дали до сега е набавувана стока или услуга од ист тип:</label>
              <div className="form-radio">
                <div>
                  <input
                    type="radio"
                    name="isti_tip_stoka"
                    checked={istTip === 1}
                    readOnly={Boolean(is_sealed)}
                    onChange={() => setIstTip(1)}
                    required
                  />
                  <label>Да</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="isti_tip_stoka"
                    checked={istTip === 0}
                    readOnly={Boolean(is_sealed)}
                    onChange={() => setIstTip(0)}
                    required
                  />
                  <label>Не</label>
                </div>
              </div>
            </div>
            <div className="form-item-inputs">
              <label>Вкупно потрошени средства по основ на набавка од тој тип:</label>
              <input
                type="number"
                placeholder="0"
                value={vkPotroseno}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setVkPotroseno(Number(e.target.value))}
                required
              />
            </div>
            <div className="form-item-inputs">
              <label>Датум</label>
              <input
                type="date"
                value={datum}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setDatum(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="form-item">
                  <h1>Информации за евиденција</h1>
        
                  <div className="form-item-inputs">
                    <label>Барател на набавка која е предмет на наплата:</label>
                    <input
                      value={baratel}
                      disabled={Boolean(is_sealed)}
                      onChange={(e) => setBaratel(e.target.value)}
                      required
                    >
                      
                    </input>
        
                    <label>Број на картон (Конто)</label>
                    <input
                      type="number"
                      value={brKarton}
                      readOnly={Boolean(is_sealed)}
                      onChange={(e) => setBrKarton(Number(e.target.value))}
                      required
                    />
        
                    <label>Назив на проектот</label>
                    <input
                      type="text"
                      value={nazivProekt}
                      readOnly={Boolean(is_sealed)}
                      onChange={(e) => setNazivProekt(e.target.value)}
                      required
                    />
                  </div>
        
                  <div className="form-item-radio">
                    <label>Потекло на финансиите:</label>
                    <div className="form-radio">
                      <label>
                        <input
                          type="radio"
                          name="poteklo"
                          value="Средства на МФС"
                          checked={poteklo === "Средства на МФС"}
                          disabled={Boolean(is_sealed)}
                          onChange={(e) => setPoteklo(e.target.value)}
                          required
                        />&nbsp;
                        Средства на МФС
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="poteklo"
                          value="Буџет"
                          checked={poteklo === "Буџет"}
                          disabled={Boolean(is_sealed)}
                          onChange={(e) => setPoteklo(e.target.value)}
                          required
                        />&nbsp;
                        Буџет
                      </label>
                    </div>
                  </div>
        
                  <div className="form-item-inputs">
                    <label>Датум</label>
                    <input
                      type="date"
                      value={datum}
                      readOnly={Boolean(is_sealed)}
                      onChange={(e) => setDatum(e.target.value)}
                      required
                    />
                  </div>

        
                  <div className="form-buttons">
                    <div></div>
                    <div className="form-buttons">
                      <div></div>
                      <div className="form-buttons-edit">
                        {is_sealed === 0 && (
                          <>
                            {!created ? (
                              <button type="submit">Зачувај</button>
                            ) : (
                              <>
                                <button onClick={() => {
                                  updateBaratelNabavka({}); 
                                  updateTipNabavka({});
                                  }}>Измени</button>
                                <button onClick={() => setShowDeleteModal(true)}>Избриши</button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {status !== "pending" ? (
                    <CommentSectionRead
                      review_comment={review_comment || ""}
                      status={status || "pending"}

                    />
                  ) : (
                    <div></div>
                  )}
                </div>
      </form>
      <SweetAlert
        visibility={showDeleteModal}
        onConfirm={deleteTipNabavka}
        onCancel={() => setShowDeleteModal(false)}
        confirmButton="Избриши"
        message="Дали сте сигурни дека сакате да ја избришeте оваа секција?"
      />
      <SweetAlert
        visibility={showUpdateModal}
        onConfirm={() => setShowUpdateModal(false)}
        onCancel={() => setShowUpdateModal(false)}
        confirmButton=""
        message="Промените се успешно реализирани"
      />


      
    </>
  );
};

export default TipNabavka;

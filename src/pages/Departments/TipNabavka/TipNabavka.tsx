import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import BaratelNabavka from "../BaratelNabavka/BaratelNabavka";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";

const TipNabavka: React.FC = () => {
  const { br_faktura } = useParams<string>();
  const [is_sealed, setIs_sealed] = useState<number>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const [tip, setTip] = useState<string>("javna");
  const [datum, setDatum] = useState<string>();
  const [review_comment, setReview_comment] = useState<string>();
  const [status, setStatus] = useState<string>("pending");

  const [brDogovor, setBrDogovor] = useState<number>();
  const [vaznostDo, setVaznostDo] = useState<string>();
  const [soglasnoDogovor, setSoglasnoDogovor] = useState<number>();
  const [ostanatiRaspSredstva, setOstanatiRaspSredstva] = useState<number>();

  const [istTip, setIstTip] = useState<number>();
  const [vkPotroseno, setVkPotroseno] = useState<number>();

  const [created, setCreated] = useState<boolean>();
  const [documentId, setDocumentId] = useState<number>();

  useEffect(() => {
    showTipNabavka();
  }, [status]);

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
        setBrDogovor(undefined);
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
        br_faktura: parseInt(br_faktura || "0", 10),
        tip: tip,
        read: true,
        datum: datum,

        br_dogovor: brDogovor,
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
          br_faktura: parseInt(br_faktura || "0", 10),
          tip: tip,
          read: true,
          datum: datum,

          br_dogovor: brDogovor,
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
      const response = await axiosClient.delete(
        `/tipnabavka/destroy/${documentId}`
      );

      if (response.status === 201) {
        console.log("Tip nabavka is deleted");

        setCreated(false);
        setTip("");
        setDatum("");
        setBrDogovor(undefined);
        setVaznostDo("");
        setSoglasnoDogovor(undefined);
        setOstanatiRaspSredstva(undefined);
        setIstTip(undefined);
        setVkPotroseno(undefined);
        setDocumentId(undefined);

        setShowDeleteModal(false);
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
        } else {
          updateTipNabavka(e);
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
                type="number"
                value={brDogovor}
                readOnly={Boolean(is_sealed)}
                onChange={(e) => setBrDogovor(Number(e.target.value))}
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

        <div className="form-buttons">
          <div></div>
          <div className="form-buttons-edit">
            {is_sealed === 0 && (
              <>
                {!created ? (
                  <button type="submit">Зачувај</button>
                ) : (
                  <>
                    <button onClick={(e) => updateTipNabavka(e)}>Измени</button>
                    <button type="button" onClick={() => {setShowDeleteModal(true)}}>Избриши</button>
                  </>
                )}
              </>
            )}
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
      </form>
      <SweetAlert
        visibility={showDeleteModal}
        onConfirm={deleteTipNabavka}
        onCancel={() => setShowDeleteModal(false)}
        confirmButton="Избриши"
        message="Дали сте сигурни дека сакате да ја избришите оваа секција?"
      />
      <SweetAlert
        visibility={showUpdateModal}
        onConfirm={() => setShowUpdateModal(false)}
        onCancel={() => setShowUpdateModal(false)}
        confirmButton=""
        message="Промените се успешно реализирани"
      />
      <BaratelNabavka />
      
    </>
  );
};

export default TipNabavka;

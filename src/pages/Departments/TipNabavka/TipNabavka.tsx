import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";
import type { BrKartonType } from "../../../types/types";

const TipNabavka: React.FC = () => {
  const { br_faktura: br_faktura_param } = useParams<{ br_faktura?: string }>();
  // decode route param so values like "123/2025" are preserved instead of being
  // interpreted as path separators by the router
  const br_faktura = br_faktura_param
    ? decodeURIComponent(br_faktura_param)
    : undefined;
  const [is_sealed, setIs_sealed] = useState<number>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showFakturaError, setShowFakturaError] = useState<boolean>(false);
  const [file, setFile] = useState<any>();

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
  const [evidencijaId, setEvidencijaId] = useState<number>();
  const [brKartoni, setBrKartoni] = useState<BrKartonType[]>([]);
  const [nazivProekt, setNazivProekt] = useState<string>("");
  const [poteklo, setPoteklo] = useState<string>("");
  const [baratel, setBaratel] = useState<string>();
  const [showAddBrKartonModal, setShowAddBrKartonModal] =
    useState<boolean>(false);
  const [newBrKarton, setNewBrKarton] = useState<string>("");
  const [brKarton_id, setBrKarton_id] = useState<number>();
  const [showUpdateModalBrKarton, setShowUpdateModalBrKarton] =
    useState<boolean>(false);

  const handleAddBrKartonModal = () => {
    setShowAddBrKartonModal(!showAddBrKartonModal);
  };

  useEffect(() => {
    showTipNabavka();
    showBaratel();
    fetchBrKarton();
  }, []);

  const showTipNabavka = async () => {
    try {
      const encoded = encodeURIComponent(br_faktura ?? "");
      const responsePDF = await axiosClient.get(`/faktura/show/${encoded}`);

      setFile(responsePDF.data.faktura.scan_file);

      const response = await axiosClient.get(`/tipnabavka/show/${encoded}`);

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

  const storeTipNabavka = async () => {
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
        setCreated(true);
        setDocumentId(response.data.document[0].id);
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const updateTipNabavka = async () => {
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
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const deleteTipNabavka = async () => {
    try {
      const responseTip = await axiosClient.delete(
        `/tipnabavka/destroy/${documentId}`
      );

      if (responseTip.status === 201) {
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
        setBrKarton_id(0);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");

        setShowDeleteModal(false);
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const storeBrKarton = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/brojKartoni", {
        br_karton: newBrKarton,
      });

      if (response.status === 201) {
        fetchBrKarton();
        setNewBrKarton("");
        setShowAddBrKartonModal(false);
        setShowUpdateModalBrKarton(true);
      }
    } catch (error: any) {
      console.error(error.response?.data || error);
      setShowFakturaError(true);
    }
  };

  const fetchBrKarton = async () => {
    try {
      const response = await axiosClient.get("/brojKartoni");

      if (response.status === 200 || response.status === 201) {
        setBrKartoni(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showBaratel = async () => {
    try {
      const encoded = encodeURIComponent(br_faktura ?? "");

      const response = await axiosClient.get(`/baratelnabavka/show/${encoded}`);

      if (response.status === 201) {
        setIs_sealed(response.data.is_sealed);
        setDocumentId(response.data.document.id);
        setBrKarton_id(response.data.document.br_kartoni_id ?? undefined);
        setNazivProekt(response.data.document.naziv_proekt);
        setPoteklo(response.data.document.poteklo);
        setDatum(response.data.document.datum);
        setBaratel(response.data.document.baratel);
        setReview_comment(response.data.document.review_comment);
        setStatus(response.data.document.status);
        setCreated(true);
      } else if (response.status === 404) {
        setBrKarton_id(0);
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

  const storeBaratelNabavka = async () => {
    try {
      const response = await axiosClient.post("/baratelnabavka/addDocument", {
        br_faktura: br_faktura || "0",
        br_kartoni_id: brKarton_id,
        naziv_proekt: nazivProekt,
        poteklo,
        datum,
        baratel: baratel,
        read: true,
      });

      if (response.status === 201) {
        setEvidencijaId(response.data.document.id);
        setCreated(true);
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const updateBaratelNabavka = async () => {
    try {
      const response = await axiosClient.patch(
        `/baratelnabavka/updateDocument/${evidencijaId}`,
        {
          br_faktura: br_faktura || "0",
          br_kartoni_id: brKarton_id,
          naziv_proekt: nazivProekt,
          poteklo,
          datum,
          baratel: baratel,
        }
      );

      if (response.status == 201) {
        setStatus("pending");
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.log(error);

      setShowFakturaError(true);
    }
  };

  const showPdf = (path: string, e: any) => {
    e.preventDefault();
    window.open(path, "_blank");
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!created) {
            storeTipNabavka();
            storeBaratelNabavka();
          } else {
            updateTipNabavka();
            updateBaratelNabavka();
          }
        }}
      >
        <div className="form-item">
          <h1>Информации за тип на набавка </h1>
          <div className="form-item-select">
            <label>
              Содржината на фактурата, предметот на наплата е согласно:
            </label>
            <select
              value={tip}
              disabled={Boolean(is_sealed)}
              onChange={(e) => setTip(e.target.value)}
            >
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
              <label>
                Останати расположливи средства по договорот (без вредност на
                фактура)
              </label>
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
              <label>
                Дали до сега е набавувана стока или услуга од ист тип:
              </label>
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
              <label>
                Вкупно потрошени средства по основ на набавка од тој тип:
              </label>
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
            ></input>

            {showAddBrKartonModal ? (
              <div>
                <label>Додај број на картон:</label>
                <div className="new-izdavac">
                  <input
                    type="text"
                    value={newBrKarton}
                    onChange={(e) => setNewBrKarton(e.target.value)}
                  />
                  <button onClick={storeBrKarton}>Додај</button>
                </div>
              </div>
            ) : (
              <div className="izberi-izdavac">
                <label>Број на картон (Конто):</label>
                <select
                  value={brKarton_id ?? ""}
                  disabled={Boolean(is_sealed)}
                  onChange={(e) => setBrKarton_id(Number(e.target.value))}
                >
                  <option value="">-- Избери број на картон (конто) --</option>
                  {brKartoni.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.br_karton}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!is_sealed &&
              (showAddBrKartonModal ? (
                <button type="button" onClick={() => handleAddBrKartonModal()}>
                  Избери број на картон (конто)
                </button>
              ) : (
                <button type="button" onClick={() => handleAddBrKartonModal()}>
                  Креирај нов број на картон (конто)
                </button>
              ))}

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
                />
                &nbsp; Средства на МФС
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
                />
                &nbsp; Буџет
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
            <button
              type="button"
              className="vidi-faktura"
              onClick={(e) => showPdf(file, e)}
            >
              Види фактура
            </button>
            <div className="form-buttons">
              <div className="form-buttons-edit">
                {is_sealed === 0 && (
                  <>
                    {!created ? (
                      <button type="submit">Зачувај</button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            updateBaratelNabavka();
                            updateTipNabavka();
                          }}
                        >
                          Измени
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Избриши
                        </button>
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
      <SweetAlert
        visibility={showUpdateModalBrKarton}
        onConfirm={() => setShowUpdateModalBrKarton(false)}
        onCancel={() => setShowUpdateModalBrKarton(false)}
        confirmButton=""
        message="Успешно е додаден нов број на картон"
      />
      <SweetAlert
        visibility={showFakturaError}
        onConfirm={() => setShowFakturaError(false)}
        onCancel={() => setShowFakturaError(false)}
        confirmButton=""
        message="Грешка при ажурирање на оваа фактура"
      />
    </>
  );
};

export default TipNabavka;

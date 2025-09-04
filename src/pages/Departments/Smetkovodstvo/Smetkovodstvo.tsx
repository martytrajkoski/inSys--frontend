import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";
import type { BrKartonType } from "../../../types/types";

const Smetkovodstvo: React.FC = () => {
  const { br_faktura } = useParams<string>();
  const [is_sealed, setIs_sealed] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showFakturaError, setShowFakturaError] = useState<boolean>(false);
  const [showAddBrKartonModal, setShowAddBrKartonModal] = useState<boolean>(false);
  const [showUpdateModalBrKarton, setShowUpdateModalBrKarton] = useState<boolean>(false);

  const [brKartoni, setBrKartoni] = useState<BrKartonType[]>([]);
  const [brKarton_id, setBrKarton_id] = useState<number>();
  const [newBrKarton, setNewBrKarton] = useState<string>("");
  const [sostojbaKarton, setSostojbaKarton] = useState<string>("");
  const [osnovaEvidentiranje, setOsnovaEvidentiranje] = useState<number>();
  const [formular, setFormular] = useState<number>();
  const [vneseniSredstva, setVneseniSredstva] = useState<number>();
  const [inventarenBr, setInventarenBr] = useState<string>();
  const [smetka, setSmetka] = useState<string>("");
  const [konto, setKonto] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [review_comment, setReview_comment] = useState<string>();
  const [status, setStatus] = useState<string>("pending");
  const [file, setFile] = useState<any>();

  const [documentId, setDocumentId] = useState<number>();
  const [created, setCreated] = useState<boolean>();

  useEffect(() => {
    showSmetkovodstvo();
    fetchBrKarton()
  }, []);

  useEffect(() => {
    if (osnovaEvidentiranje === 0) {
      setFormular(0);
      setVneseniSredstva(0);
      setInventarenBr("0");
    }
  }, [osnovaEvidentiranje]);


  const handleAddBrKartonModal = () => {
    setShowAddBrKartonModal(!showAddBrKartonModal);
  };

  const showSmetkovodstvo = async () => {
    try {

      const responsePDF = await axiosClient.get(`/faktura/show/${br_faktura}`);

      setFile(responsePDF.data.faktura.scan_file);

      const response = await axiosClient.get(
        `/smetkovodstvo/show/${br_faktura}`
      );

      if (response.status === 201) {
        setIs_sealed(response.data.is_sealed);
        setDocumentId(response.data.document.id);
        setBrKarton_id(response.data.document.br_kartoni_id ?? undefined);
        setSostojbaKarton(response.data.document.sostojba_karton);
        setOsnovaEvidentiranje(response.data.document.osnova_evidentiranje);
        setFormular(response.data.document.formular);
        setVneseniSredstva(response.data.document.vneseni_sredstva);
        setInventarenBr(response.data.document.inventaren_br);
        setSmetka(response.data.document.smetka);
        setKonto(response.data.document.konto);
        setDatum(response.data.document.datum);
        setStatus(response.data.document.status);
        setReview_comment(response.data.document.review_comment);
        setCreated(true);
      } else if (response.status === 404) {
        setIs_sealed(0);
        setBrKarton_id(0);
        setSostojbaKarton("");
        setOsnovaEvidentiranje(undefined);
        setFormular(undefined);
        setVneseniSredstva(undefined);
        setInventarenBr("");
        setSmetka("");
        setKonto("");
        setDatum("");
        setCreated(false);
        setReview_comment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storeSmetkovodstvo = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/smetkovodstvo/addDocument", {
        br_kartoni_id: brKarton_id,
        br_faktura: br_faktura || "0",
        sostojba_karton: sostojbaKarton,
        osnova_evidentiranje: osnovaEvidentiranje,
        formular: formular,
        vneseni_sredstva: vneseniSredstva,
        inventaren_br: inventarenBr,
        smetka: smetka,
        konto: konto,
        datum: datum,
        read: true,
      });

      if (response.status === 201) {
        setCreated(true);
        setDocumentId(response.data.document.id);
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const updateSmetkovodstvo = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.patch(
        `/smetkovodstvo/updateDocument/${documentId}`,
        {
          br_kartoni_id: brKarton_id,
          br_faktura: br_faktura || "0",
          sostojba_karton: sostojbaKarton,
          osnova_evidentiranje: osnovaEvidentiranje,
          formular: formular,
          vneseni_sredstva: vneseniSredstva,
          inventaren_br: inventarenBr,
          smetka: smetka,
          konto: konto,
          datum: datum,
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

  const deleteSmetkovodstvo = async () => {
    try {
      const response = await axiosClient.delete(
        `/smetkovodstvo/destroy/${documentId}`
      );

      if (response.status === 201) {
        setBrKarton_id(0);
        setSostojbaKarton("");
        setOsnovaEvidentiranje(undefined);
        setFormular(undefined);
        setVneseniSredstva(undefined);
        setInventarenBr("");
        setSmetka("");
        setKonto("");
        setDatum("");
        setCreated(false);

        setShowDeleteModal(false);
      }
    } catch (error) {
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

  const showPdf = (path: string, e: any) => {
    e.preventDefault()
    window.open(path, "_blank");
  };

  return (
    <>
      <form onSubmit={storeSmetkovodstvo}>
        <div className="form-item">
          <h1>Информации од сметководство</h1>
          <div className="form-item-inputs">
            <label>Состојба на картон (контон)</label>
            <input
              type="text"
              value={sostojbaKarton}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setSostojbaKarton(e.target.value)}
              required
            />

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
              ))
            }
          </div>

          <div className="form-item-radio">
            <label>Предметот на набавка има основа за евидентирање како основно средство(а):</label>
            <div className="form-radio">
              <label>
                <input
                  type="radio"
                  name="osnova"
                  checked={osnovaEvidentiranje === 1}
                  disabled={Boolean(is_sealed)}
                  onChange={() => setOsnovaEvidentiranje(1)}
                  required
                />&nbsp;
                Да
              </label>
              <label>
                <input
                  type="radio"
                  name="osnova"
                  checked={osnovaEvidentiranje === 0}
                  disabled={Boolean(is_sealed)}
                  onChange={() => setOsnovaEvidentiranje(0)}
                  required
                />&nbsp;
                Не
              </label>
            </div>
          </div>

          <div className="form-item-radio">
            <label>Пополнет е формулар за задолжување на основно средство:</label>
            <div className="form-radio">
              <label>
                <input
                  type="radio"
                  name="formular"
                  checked={formular === 1}
                  disabled={Boolean(is_sealed) || osnovaEvidentiranje === 0}
                  onChange={() => setFormular(1)}
                  required
                />&nbsp;
                Да
              </label>
              <label>
                <input
                  type="radio"
                  name="formular"
                  checked={formular === 0}
                  disabled={Boolean(is_sealed) || osnovaEvidentiranje === 0}
                  onChange={() => setFormular(0)}
                  required
                />&nbsp;
                Не
              </label>
            </div>
          </div>

          <div className="form-item-radio">
            <label>Средствата се внесени (поединечно) како новонабавени за тековната година:</label>
            <div className="form-radio">
              <label>
                <input
                  type="radio"
                  name="sredstva"
                  checked={vneseniSredstva === 1}
                  disabled={Boolean(is_sealed) || osnovaEvidentiranje === 0}
                  onChange={() => setVneseniSredstva(1)}
                  required
                />&nbsp;
                Да
              </label>
              <label>
                <input
                  type="radio"
                  name="sredstva"
                  checked={vneseniSredstva === 0}
                  disabled={Boolean(is_sealed) || osnovaEvidentiranje === 0}
                  onChange={() => setVneseniSredstva(0)}
                  required
                />&nbsp;
                Не
              </label>
            </div>
          </div>

          <div className="form-item-inputs">
            <label>Инвентарен број на основно средство:</label>
            <input
              type="text"
              value={inventarenBr}
              readOnly={Boolean(is_sealed) || osnovaEvidentiranje === 0}
              onChange={(e) => setInventarenBr(e.target.value)}
              required
            />
          </div>

          <div className="form-item-radio">
            <label>Предлог сметка за наплата од:</label>
            <div className="form-radio">
              <label>
                <input
                  type="radio"
                  name="smetka"
                  checked={smetka === "603"}
                  disabled={Boolean(is_sealed)}
                  onChange={() => setSmetka("603")}
                  required
                />&nbsp;
                603
              </label>
              <label>
                <input
                  type="radio"
                  name="smetka"
                  checked={smetka === "788"}
                  disabled={Boolean(is_sealed)}
                  onChange={() => setSmetka("788")}
                  required
                />&nbsp;
                788
              </label>
            </div>
          </div>

          <div className="form-item-inputs">
            <label>Предлог конто за наплата од:</label>
            <input
              type="text"
              value={konto}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setKonto(e.target.value)}
              required
            />
            <label>Датум:</label>
            <input
              type="date"
              placeholder="Датум"
              value={datum}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setDatum(e.target.value)}
              required
            />
          </div>

          <div className="form-buttons">
            <button className="vidi-faktura"
              onClick={(e) => showPdf(file, e)}
            >Види фактура</button>
            <div className="form-buttons-edit">
              {is_sealed === 0 && (
                <>
                  {!created ? (
                    <button type="submit">Зачувај</button>
                  ) : (
                    <>
                      <button type="button" onClick={updateSmetkovodstvo}>Измени</button>
                      <button type="button" onClick={() => setShowDeleteModal(true)}>Избриши</button>
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
        </div>
      </form>
      <SweetAlert
        visibility={showDeleteModal}
        onConfirm={deleteSmetkovodstvo}
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
      <SweetAlert
        visibility={showFakturaError}
        onConfirm={() => setShowFakturaError(false)}
        onCancel={() => setShowFakturaError(false)}
        confirmButton=""
        message="Грешка при ажурирање на оваа фактура"
      />
      <SweetAlert
        visibility={showUpdateModalBrKarton}
        onConfirm={() => setShowUpdateModalBrKarton(false)}
        onCancel={() => setShowUpdateModalBrKarton(false)}
        confirmButton=""
        message="Успешно е додаден нов број на картон"
      />
    </>
  );
};

export default Smetkovodstvo;
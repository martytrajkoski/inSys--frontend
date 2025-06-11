import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";

const Smetkovodstvo: React.FC = () => {
  const navigate = useNavigate(); 

  const { br_faktura } = useParams<string>();
  const [is_sealed, setIs_sealed] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

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
        setIs_sealed(response.data.is_sealed);
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
        setIs_sealed(0);
        setBrKarton(undefined);
        setSostojbaKarton("");
        setOsnovaEvidentiranje(undefined);
        setFormular(undefined);
        setVneseniSredstva(undefined);
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
        navigate('/')
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
        setStatus("pending");
        setShowUpdateModal(true);
        console.log("Smetkovodstvo updated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSmetkovodstvo = async () => {
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
console.log('is_sealed', is_sealed)
  return (
    <>
      <form onSubmit={storeSmetkovodstvo}>
        <div className="form-item">
          <h1>Информации од сметководство</h1>
          <div className="form-item-inputs">
            <label>Број на картон:</label>
            <input
              type="number"
              value={brKarton}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setBrKarton(Number(e.target.value))}
              required
            />
            <label>Состојба на картон (конто):</label>
            <input
              type="text"
              value={sostojbaKarton}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setSostojbaKarton(e.target.value)}
              required
            />
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
                  disabled={Boolean(is_sealed)}
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
                  disabled={Boolean(is_sealed)}
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
                  disabled={Boolean(is_sealed)}
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
                  disabled={Boolean(is_sealed)}
                  onChange={() => setVneseniSredstva(0)}
                  required
                />&nbsp;
                Не
              </label>
            </div>
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
            <div></div>
            <div className="form-buttons-edit">
              {is_sealed === 0 && (
                <>
                  {!created ? (
                    <button type="submit">Зачувај</button>
                  ) : (
                    <>
                      <button onClick={updateSmetkovodstvo}>Измени</button>
                      <button onClick={()=>setShowDeleteModal(true)}>Избриши</button>
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
    </>
  );
};

export default Smetkovodstvo;

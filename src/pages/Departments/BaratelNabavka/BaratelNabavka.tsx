import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import type { Baratel } from "../../../types/types";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";

const BaratelNabavka: React.FC = () => {
  const { br_faktura } = useParams<{ br_faktura: string }>();
  const [is_sealed, setIs_sealed] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [brKarton, setBrKarton] = useState<number>();
  const [nazivProekt, setNazivProekt] = useState<string>("");
  const [poteklo, setPoteklo] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [baratelId, setBaratelId] = useState<number>();
  const [barateli, setBarateli] = useState<Baratel[]>([]);
  const [review_comment, setReview_comment] = useState<string>();
  const [status, setStatus] = useState<string>("pending");

  const [documentId, setDocumentId] = useState<number>();
  const [created, setCreated] = useState<boolean>();
  
  useEffect(() => {
    fetchBarateli();
    showBaratel();
  }, [status]);

  const fetchBarateli = async () => {
    try {
      const response = await axiosClient.get("/barateli/");
      setBarateli(response.data);
    } catch (error) {
      console.error("Failed to fetch barateli", error);
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
        setBaratelId(response.data.document.baratel_id);
        setReview_comment(response.data.document.review_comment);
        setStatus(response.data.document.status);
        setCreated(true);
      } else if (response.status === 404) {
        setBrKarton(undefined);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");
        setBaratelId(undefined);
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
        baratel_id: baratelId,
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
          baratel_id: baratelId,
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

  const deleteBaratelNabavka = async () => {
    try {
      const response = await axiosClient.delete(
        `/baratelnabavka/destroy/${documentId}`
      );

      if (response.status === 201) {
        setDocumentId(undefined);
        setCreated(false);
        setBaratelId(undefined);
        setBrKarton(0);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");

        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={storeBaratelNabavka}>
        <div className="form-item">
          <h1>Информации за евиденција</h1>

          <div className="form-item-inputs">
            <label>Избери барател</label>
            <select
              value={baratelId}
              disabled={Boolean(is_sealed)}
              onChange={(e) => setBaratelId(Number(e.target.value))}
              required
            >
              <option value="">-- Избери барател --</option>
              {barateli.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

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
                        <button onClick={updateBaratelNabavka}>Измени</button>
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
          onConfirm={deleteBaratelNabavka}
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

export default BaratelNabavka;

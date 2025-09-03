import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { IzdavaciType } from "../../../types/types";
import { useNavigate, useParams } from "react-router-dom";
import CommentSectionRead from "../../../components/Comment-Section/Comment-Section-Read";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const TehnickiSekretar: React.FC = () => {
  const { br_faktura } = useParams<string>();
  const [is_sealed, setIs_sealed] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showAddIzdavacModal, setShowAddIzdavacModal] = useState<boolean>(false);
  const [showAddIzdavacSuccess, setShowAddIzdavacSuccess] = useState<boolean>(false);
  const [showDuplicateFakturaError, setShowDuplicateFakturaError] = useState<boolean>(false);
  const [showFakturaError, setShowFakturaError] = useState<boolean>(false);
  const [showIzdavaciError, setShowIzdavaciError] = useState<boolean>(false);
  const [newIzdavac, setNewIzdavac] = useState<string>("");

  const [arhivski_br, setArhivski_br] = useState<string>("");
  const [br_fakturaa, setBr_fakturaa] = useState<string>();
  const [izdavaci_id, setIzdavaci_id] = useState<number>();
  const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
  const [iznos_dogovor, setIznos_dogovor] = useState<number>();
  const [datum, setDatum] = useState<string>("");
  const [review_comment, setReview_comment] = useState<string>();
  const [status, setStatus] = useState<string>("pending");
  const [file, setFile] = useState<any>();

  const [created, setCreated] = useState<boolean>();
  const [documentId, setDocumentId] = useState<number>();

  const navigate = useNavigate();

  const handleDrop = (e: any) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const fetchTehnicki = async () => {
    try {
      const response = await axiosClient.get(
        `/tehnickisekretar/show/${br_faktura}`
      );

      if (response.status === 201 && response.data.document) {
        const document = response.data.document;

        setIs_sealed(response.data.is_sealed);
        setDocumentId(document.id ?? undefined);
        setArhivski_br(document.arhivski_br ?? "");
        setBr_fakturaa(document.br_faktura ?? "");
        setIzdavaci_id(document.izdavaci_id ?? undefined);
        setIznos_dogovor(document.iznos_dogovor ?? undefined);
        setDatum(document.datum ?? "");
        setFile(response.data.scan_file ?? "");
        setReview_comment(document.review_comment ?? "");
        setStatus(document.status ?? "pending");
        setCreated(true);
      } else if (response.status === 404) {
        setIs_sealed(0);
        setDocumentId(undefined);
        setArhivski_br("");
        setBr_fakturaa("");
        setIzdavaci_id(undefined);
        setIznos_dogovor(undefined);
        setDatum("");
        setFile(response.data.scan_file);
        setDocumentId(undefined);
        setCreated(false);
        setReview_comment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storeTehnicki = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("arhivski_br", arhivski_br);
      formData.append("br_faktura", br_fakturaa || "");
      formData.append("izdavaci_id", String(izdavaci_id));
      formData.append("iznos_dogovor", String(iznos_dogovor || 0));
      formData.append("datum", datum);
      if (file) formData.append("scan_file", file);

      const response = await axiosClient.post(
        "/tehnickisekretar/addDocument",
        formData
      );

      if (response.status === 201) {
        setDocumentId(response.data.document.id);
        setCreated(true);
        navigate("/");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setShowDuplicateFakturaError(true);
      } else {
        setShowFakturaError(true);
      }
    }
  };

  const storeIzdavac = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/izdavaci/", {
        name: newIzdavac,
      });

      if (response.status === 201) {
        setIzdavaci_id(response.data.id);
        setShowAddIzdavacSuccess(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setShowIzdavaciError(true);
      } else {
        console.error("Error adding izdavac:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const updateTehnicki = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("arhivski_br", arhivski_br);
      formData.append("br_faktura", br_fakturaa || "");
      formData.append("izdavaci_id", String(izdavaci_id));
      formData.append("iznos_dogovor", String(iznos_dogovor || 0));
      formData.append("datum", datum);
      if (file instanceof File) {
        formData.append("scan_file", file);
      }

      const response = await axiosClient.patch(
        `/tehnickisekretar/updateDocument/${documentId}`,
        formData
      );

      if (response.status === 201) {
        setStatus("pending");
        setShowUpdateModal(true);
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const deleteTehnicki = async () => {
    try {
      const response = await axiosClient.delete(
        `/tehnickisekretar/destroy/${documentId}`
      );

      if (response.status === 201) {
        setArhivski_br("");
        setBr_fakturaa("");
        setIzdavaci_id(0);
        setIznos_dogovor(0);
        setDatum("");
        setFile("");
        setCreated(false);
        setDocumentId(0);

        navigate("/");
      }
    } catch (error) {
      setShowFakturaError(true);
    }
  };

  const fetchIzdavaci = async () => {
    try {
      const response = await axiosClient.get("/izdavaci");

      if (response.status === 201) {
        setIzdavaci(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddIzdavacModal = () => {
    setShowAddIzdavacModal(!showAddIzdavacModal);
  };

  useEffect(() => {
    fetchIzdavaci();
    fetchTehnicki();
  }, [status]);

  const showPdf = (path: string, e: any) => {
    e.preventDefault();
    window.open(path, "_blank");
  };

  return (
    <>
      <h1>Основни информации</h1>
      <form onSubmit={storeTehnicki}>
        <div className="form-item">
          <div className="form-item-inputs">
            <label>Aрхивски број</label>
            <input
              type="text"
              value={arhivski_br}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setArhivski_br(e.target.value)}
            />
            <label>Број на фактура</label>
            <input
              type="text"
              value={br_fakturaa}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setBr_fakturaa(e.target.value)}
            />
            <label>Износ на договор</label>
            <input
              type="number"
              value={iznos_dogovor}
              placeholder="0"
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setIznos_dogovor(Number(e.target.value))}
            />
            {showAddIzdavacModal ? (
              <div>
                <label>Додај издавач:</label>
                <div className="new-izdavac">
                  <input
                    type="text"
                    value={newIzdavac}
                    onChange={(e) => setNewIzdavac(e.target.value)}
                  />
                  <button onClick={storeIzdavac}>Додај</button>
                </div>
              </div>
            ) : (
              <div className="izberi-izdavac">
                <label>Издавач на фактурата:</label>
                <select
                  value={izdavaci_id ?? ""}
                  disabled={Boolean(is_sealed)}
                  onChange={(e) => setIzdavaci_id(Number(e.target.value))}
                >
                  <option value="">-- Избери издавач --</option>
                  {izdavaci.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!is_sealed &&
              (showAddIzdavacModal ? (
                <button type="button" onClick={() => handleAddIzdavacModal()}>
                  Избери издавач
                </button>
              ) : (
                <button type="button" onClick={() => handleAddIzdavacModal()}>
                  Креирај нов издавач
                </button>
              ))}
            {!is_sealed && (
              <>
                <label>Прикачи фактура: </label>
                <div
                  className="upload-container"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="upload-content">
                    <div className="upload-icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <p>
                      Drag & drop or{" "}
                      <span className="upload-choose">Choose file</span> to
                      upload
                    </p>
                    <p className="upload-formats">PDF</p>
                    <input
                      type="file"
                      className="upload-input"
                      onChange={handleFileChange}
                      accept="application/pdf"
                    />

                    {file && <p>{file.name}</p>}
                  </div>
                </div>
              </>
            )}

            <label>Датум</label>
            <input
              type="date"
              value={datum}
              readOnly={Boolean(is_sealed)}
              onChange={(e) => setDatum(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            {br_faktura ? (
              <button
                className="vidi-faktura"
                onClick={(e) => showPdf(file, e)}
              >
                Види фактура
              </button>
            ) : (
              <div></div>
            )}
            <div className="form-buttons-edit">
              {is_sealed === 0 && (
                <>
                  {!created ? (
                    <button type="submit">Зачувај</button>
                  ) : (
                    <>
                      <button onClick={updateTehnicki}>Измени</button>
                      <button onClick={() => setShowDeleteModal(true)}>
                        Избриши
                      </button>
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
        onConfirm={deleteTehnicki}
        onCancel={() => setShowDeleteModal(false)}
        confirmButton="Избриши"
        message="Дали сте сигурни дека сакате да ја избришите оваа фактура?"
      />
      <SweetAlert
        visibility={showUpdateModal}
        onConfirm={() => setShowUpdateModal(false)}
        onCancel={() => setShowUpdateModal(false)}
        confirmButton=""
        message="Промените се успешно реализирани"
      />
      <SweetAlert
        visibility={showAddIzdavacSuccess}
        onConfirm={() => setShowAddIzdavacSuccess(false)}
        onCancel={() => setShowAddIzdavacSuccess(false)}
        confirmButton=""
        message="Успешно креиран издавач"
      />
      <SweetAlert
        visibility={showDuplicateFakturaError}
        onConfirm={() => setShowDuplicateFakturaError(false)}
        onCancel={() => setShowDuplicateFakturaError(false)}
        confirmButton=""
        message="Фактура со овој број на фактура веќе постои"
      />
      <SweetAlert
        visibility={showFakturaError}
        onConfirm={() => setShowFakturaError(false)}
        onCancel={() => setShowFakturaError(false)}
        confirmButton=""
        message="Грешка при креирање на оваа фактура"
      />
      <SweetAlert
        visibility={showIzdavaciError}
        onConfirm={() => setShowIzdavaciError(false)}
        onCancel={() => setShowIzdavaciError(false)}
        confirmButton=""
        message="Издавач со ова име веќе постои"
      />
    </>
  );
};

export default TehnickiSekretar;

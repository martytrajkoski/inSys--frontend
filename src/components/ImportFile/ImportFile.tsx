import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { IzdavaciType } from "../../types/types";

interface ScanInvoiceModalProps {
  onClose: () => void;
}

const ImportFile: React.FC<ScanInvoiceModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [br_faktura, setBr_faktura] = useState<string>();
  const [arhivski_br, setArhivski_br] = useState<string>();
  const [datum, setDatum] = useState<string>();
  const [izdavaci, setIzdavaci] = useState<IzdavaciType[]>([]);
  const [izdavaci_id, setIzdavaci_id] = useState<number>();
  const [showAddIzdavacModal, setShowAddIzdavacModal] = useState<boolean>(false);
  const [newIzdavac, setNewIzdavac] = useState<string>("");

  const [showAlert, setShowAlert] = useState(false);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  console.log(izdavaci_id);
  const handleUpload = async () => {
    if (!arhivski_br || !br_faktura || !izdavaci_id || !datum || !file) {
      setShowAlert(true);
    }

    

    const formData = new FormData();
    formData.append("arhivski_br", arhivski_br || "");
    formData.append("br_faktura", br_faktura || "");
    formData.append("izdavaci_id", (izdavaci_id ?? "").toString());
    formData.append("datum", datum || "");
    formData.append("scan_file", file);

    try {
      const response = await axiosClient.post(
        "/tehnickisekretar/store_pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Tehnicki Sekretar and Faktura created");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
      }
    }
  };

  const handleAddIzdavacModal = () => {
    setShowAddIzdavacModal(!showAddIzdavacModal);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

    const storeIzdavac = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/izdavaci/", {
        name: newIzdavac,
      });

      if (response.status === 201) {
        setIzdavaci_id(response.data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIzdavaci = async () => {
    try {
      const response = await axiosClient.get("/izdavaci/");

      if (response.status === 201) {
        setIzdavaci(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchIzdavaci();
  }, [])

  return (
    <div className="import-file-backdrop">
      <div className="import-file" ref={containerRef}>
        <div className="import-file-header">
          <h1>Прикачи фактура</h1>
          <FontAwesomeIcon
            icon={faClose}
            className="close-button"
            onClick={() => onClose?.()}
          />
        </div>
        <div className="import-file-container">
          <div className="import-file-inputs">
            <div className="inputs">
              <input
                type="text"
                placeholder="Број на фактура"
                value={br_faktura}
                onChange={(e) => setBr_faktura(e.target.value)}
                onFocus={() => setShowAlert(false)}
              />
              <input
                type="text"
                placeholder="Архивски број"
                value={arhivski_br}
                onChange={(e) => setArhivski_br(e.target.value)}
                onFocus={() => setShowAlert(false)}
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
                {showAddIzdavacModal ? (
                  <button onClick={() => handleAddIzdavacModal()}>
                    Избери издавач
                  </button>
                ) : (
                  <button onClick={() => handleAddIzdavacModal()}>
                    Креирај нов издавач
                  </button>
                )}
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                onFocus={() => setShowAlert(false)}
              />
            </div>
            {showAlert && (
              <p style={{ color: "red" }}>Пополнете ги сите полиња!</p>
            )}
            <button onClick={handleUpload}>Прикачи</button>
          </div>
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
                <span className="upload-choose">Choose file</span> to upload
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
        </div>
      </div>
    </div>
  );
};

export default ImportFile;

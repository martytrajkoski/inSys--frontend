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

  //DOGOVOR
  const [brDogovor, setBrDogovor] = useState<string>();
  const [dogovori, setDogovori] = useState<any[]>([]);
  const [showCreateDogovorModal, setShowCreateDogovorModal] = useState<boolean>(false);
  const [newDogovor, setNewDogovor] = useState({
    br_dog: "",
    datum_od_dog: "",
    datum_do_dog: "",
    iznos_dog: 0,
  });
  const [isCreatingDogovor, setIsCreatingDogovor] = useState(false);
  const [dogovorError, setDogovorError] = useState<string>("");
  const [vk_vrednost, setVk_vrednost] = useState<number>();
  const [soglasnoDogovor, setSoglasnoDogovor] = useState<number>();
  const [calculatedOstanati, setCalculatedOstanati] = useState<number | null>(null);

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

  const navigateToCreateDogovor = () => {
    setShowCreateDogovorModal(true);
  };

  const calculateRemainingAmount = async () => {
    console.log("=== CALCULATION START ===");
    console.log("brDogovor:", brDogovor);
    console.log("vk_vrednost:", vk_vrednost);
    console.log("dogovori array:", dogovori);
    
    if (!brDogovor || !vk_vrednost) {
      console.log("RETURNING: Missing brDogovor or vk_vrednost");
      return null;
    }
    
    const selectedDogovor = dogovori.find(d => d.br_dog === brDogovor);
    console.log("selectedDogovor:", selectedDogovor);
    
    if (!selectedDogovor) {
      console.log("RETURNING: No dogovor found");
      return null;
    }
    
    try {
      // Fetch all invoices for this contract
      console.log("Making API call to:", `/dogovori/${selectedDogovor.id}/fakturi`);
      const response = await axiosClient.get(`/dogovori/${selectedDogovor.id}/fakturi`);
      console.log("API response:", response.data);
      const contractInvoices = response.data;
      
      const totalContractAmount = selectedDogovor.iznos_dog || 0;
      console.log("totalContractAmount:", totalContractAmount);
      
      const totalInvoicesAmount = contractInvoices.reduce((sum: number, inv: any) => {
        // Skip the current invoice if we're editing it (by comparing br_faktura)
        if (inv.br_faktura === br_faktura) {
          console.log("Skipping current invoice:", inv.br_faktura);
          return sum;
        }
        
        // Get amount from javna_nabavka relationship if it exists
        let invAmount = 0;
        if (inv.tip_nabavka && inv.tip_nabavka.javna_nabavka) {
          invAmount = inv.tip_nabavka.javna_nabavka.vk_vrednost || 0;
        } else if (inv.tip_nabavka && inv.tip_nabavka.tender) {
          invAmount = inv.tip_nabavka.tender.vk_potroseno || 0;
        }
        console.log("Processing invoice:", inv.br_faktura, "amount:", invAmount, "tip_nabavka:", inv.tip_nabavka);
        return sum + invAmount;
      }, 0);
      console.log("totalInvoicesAmount:", totalInvoicesAmount);
      console.log("totalContractAmount:", totalContractAmount);
      
      // Calculate remaining amount BEFORE adding current invoice
      const remainingWithoutCurrent = totalContractAmount - totalInvoicesAmount;
      console.log("Remaining before current invoice:", remainingWithoutCurrent);
      
      // Subtract current invoice amount dynamically
      const remainingWithCurrent = remainingWithoutCurrent - (vk_vrednost || 0);
      console.log("Final remaining (after subtracting current invoice):", remainingWithCurrent);
      
      setCalculatedOstanati(remainingWithCurrent);
      return remainingWithCurrent;
    } catch (error) {
      console.error("Error fetching invoices for calculation:", error);
      return null;
    }
  };

  const handleVkVrednostChange = (value: number) => {
    console.log("vk_vrednost changed to:", value);
    setVk_vrednost(value);
    
    // Immediately calculate remaining after amount changes
    if (brDogovor && value) {
      setTimeout(() => calculateRemainingAmount(), 0);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with:", { brDogovor, vk_vrednost, dogovori });
    if (brDogovor && vk_vrednost) {
      calculateRemainingAmount();
    }
  }, [brDogovor, vk_vrednost, dogovori]);

  const handleCreateDogovor = async (e: any) => {
    e.preventDefault();
    setIsCreatingDogovor(true);
    setDogovorError("");

    try {
      const response = await axiosClient.post("/dogovori", newDogovor);
      
      if (response.status === 201) {
        // Refresh dogovori list
        fetchDogovori();
        
        // Select the newly created dogovor
        setBrDogovor(response.data.br_dog);
        
        // Close modal and reset form
        setShowCreateDogovorModal(false);
        setNewDogovor({
          br_dog: "",
          datum_od_dog: "",
          datum_do_dog: "",
          iznos_dog: 0,
        });
      }
    } catch (error: any) {
      setDogovorError(error.response?.data?.message || "Грешка при креирање на договор");
    } finally {
      setIsCreatingDogovor(false);
    }
  };

  const fetchDogovori = async () => {
    try {
      const response = await axiosClient.get("/dogovori");
      if (response.status === 200) {
        setDogovori(response.data);
      }
    } catch (error) {
      console.error("Error fetching dogovori:", error);
    }
  };

  useEffect(() => {
    showTipNabavka();
    showBaratel();
    fetchBrKarton();
    fetchDogovori();
    
    // Check if there's a newly created dogovor to select
    const selectedDogovor = localStorage.getItem('selectedDogovor');
    if (selectedDogovor) {
      setBrDogovor(selectedDogovor);
      localStorage.removeItem('selectedDogovor');
    }
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
          setSoglasnoDogovor(doc.javna_nabavka.soglasno_dogovor);
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
        setSoglasnoDogovor(undefined);
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
        rasp_sredstva: calculatedOstanati,
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
      // Delete tip nabavka section
      if (documentId) {
        try {
          await axiosClient.delete(`/tipnabavka/destroy/${documentId}`);
        } catch (error) {
          console.error("Error deleting tip nabavka:", error);
        }
      }

      // Delete baratel nabavka section
      if (documentId) {
        try {
          await axiosClient.delete(`/baratelnabavka/destroy/${documentId}`);
        } catch (error) {
          console.error("Error deleting baratel nabavka:", error);
        }
      }

      // Clear all form data for both sections
      setCreated(false);
      setTip("");
      setDatum("");
      setBrDogovor("");
      setVk_vrednost(undefined);
      setSoglasnoDogovor(undefined);
      setIstTip(undefined);
      setVkPotroseno(undefined);
      setDocumentId(undefined);
      
      // Clear evidencija section
      setBaratel("");
      setBrKarton_id(0);
      setNazivProekt("");
      setPoteklo("");
      setReview_comment("");
      setStatus("pending");
      setEvidencijaId(undefined);

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error during deletion:", error);
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
      setShowFakturaError(true);
    }
  };

  const showPdf = (path: string, e: any) => {
    e.preventDefault();
    window.open(path, "_self");
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
              <select
                value={brDogovor}
                disabled={Boolean(is_sealed)}
                onChange={(e) => setBrDogovor(e.target.value)}
                required
              >
                <option value="">-- Избери договор --</option>
                {dogovori.map((dogovor) => (
                  <option key={dogovor.id} value={dogovor.br_dog}>
                    {dogovor.br_dog}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={navigateToCreateDogovor}
                disabled={Boolean(is_sealed)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#e45830",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginTop: "10px"
                }}
              >
                Креирај нов договор
              </button>
              <label>Вкупна вредност на фактура (со ДДВ)</label>
              <input
                type="text"
                value={vk_vrednost || ""}
                placeholder="0"
                onChange={(e) => handleVkVrednostChange(Number(e.target.value) || 0)}
                required
              />
              <label>
                Останати расположливи средства по договорот:
              </label>
              <div style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                color: calculatedOstanati !== null && calculatedOstanati < 0 ? "#dc3545" : "#333",
                fontWeight: "bold",
                fontSize: "14px"
              }}>
                {calculatedOstanati !== null ? calculatedOstanati.toLocaleString('mk-MK') : "0"}
              </div>
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
                <button 
                  type="button" 
                  onClick={() => handleAddBrKartonModal()}
                  style={{ marginTop: "15px" }}
                >
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

      {/* Create Dogovor Modal */}
      {showCreateDogovorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Креирај нов договор</h2>
            
            <form onSubmit={handleCreateDogovor}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Број на договор *
                  </label>
                  <input
                    type="text"
                    name="br_dog"
                    value={newDogovor.br_dog}
                    onChange={(e) => setNewDogovor(prev => ({ ...prev, br_dog: e.target.value }))}
                    required
                    placeholder="Внесете број на договор"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Датум од *
                  </label>
                  <input
                    type="date"
                    name="datum_od_dog"
                    value={newDogovor.datum_od_dog}
                    onChange={(e) => setNewDogovor(prev => ({ ...prev, datum_od_dog: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Датум до *
                  </label>
                  <input
                    type="date"
                    name="datum_do_dog"
                    value={newDogovor.datum_do_dog}
                    onChange={(e) => setNewDogovor(prev => ({ ...prev, datum_do_dog: e.target.value }))}
                    required
                    min={newDogovor.datum_od_dog}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Износ на договор *
                  </label>
                  <input
                    type="number"
                    name="iznos_dog"
                    value={newDogovor.iznos_dog}
                    onChange={(e) => setNewDogovor(prev => ({ ...prev, iznos_dog: Number(e.target.value) }))}
                    required
                    min="0"
                    step="1"
                    placeholder="Внесете износ"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {dogovorError && (
                  <div style={{
                    color: 'red',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {dogovorError}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateDogovorModal(false);
                      setDogovorError("");
                      setNewDogovor({
                        br_dog: "",
                        datum_od_dog: "",
                        datum_do_dog: "",
                        iznos_dog: 0,
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Откажи
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isCreatingDogovor}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isCreatingDogovor ? '#6c757d' : '#007bff',
                      color: 'white',
                      cursor: isCreatingDogovor ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isCreatingDogovor ? 'Креирање...' : 'Креирај'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TipNabavka;

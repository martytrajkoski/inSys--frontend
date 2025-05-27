import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import type { Baratel } from "../../../types/types";

const BaratelNabavka: React.FC = () => {
  const { br_faktura } = useParams<{ br_faktura: string }>();
  const [brKarton, setBrKarton] = useState<number>();
  const [nazivProekt, setNazivProekt] = useState<string>("");
  const [poteklo, setPoteklo] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [baratelId, setBaratelId] = useState<number>();
  const [barateli, setBarateli] = useState<Baratel[]>([]);

  const [documentId, setDocumentId] = useState<number>();
  const [created, setCreated] = useState<boolean>();

  useEffect(() => {
    fetchBarateli();
    showBaratel();
  }, []);
  
  const fetchBarateli = async () => {
    try {
      const response = await axiosClient.get("/barateli/");
      setBarateli(response.data);
    } catch (error) {
      console.error("Failed to fetch barateli", error);
    }
  };

  const showBaratel = async() => {
    try {
      const response = await axiosClient.get(`/baratelnabavka/show/${br_faktura}`)

      if(response.status === 201){
        setBrKarton(response.data.document.br_karton);
        setNazivProekt(response.data.document.naziv_proekt);
        setPoteklo(response.data.document.poteklo);
        setDatum(response.data.document.datum);
        setBaratelId(response.data.document.baratel_id);
        setCreated(true);
      }
      else if(response.status === 404){
        setBrKarton(undefined);
        setNazivProekt("");
        setPoteklo("");
        setDatum("");
        setBaratelId(undefined);
        setCreated(false);
      }

    } catch (error) {
      console.error(error);
    }
  }  

  const storeBaratelNabavka = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/baratelnabavka/addDocument", {
        br_faktura: parseInt(br_faktura || "0", 10),
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
          br_faktura: parseInt(br_faktura || "0", 10),
          br_karton: brKarton,
          naziv_proekt: nazivProekt,
          poteklo,
          datum,
          baratel_id: baratelId,
        }
      );

      if (response.status == 201) {
        console.log("BaratelNabavka is updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBaratelNabavka = async(e:any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.delete(`/baratelnabavka/destroy/${documentId}`);

      if(response.status === 201){
        setDocumentId(undefined);
        setCreated(false);
        setBaratelId(undefined);
        setBrKarton(0);
        setNazivProekt('');
        setPoteklo('');
        setDatum('');
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <form onSubmit={storeBaratelNabavka}>
        <div className="form-item">
          <h3>Информации за евиденција</h3>

          <div className="form-item-inputs">
            <select
              value={baratelId}
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

            <input
              type="number"
              placeholder="Број на картон (Конто)"
              value={brKarton}
              onChange={(e) => setBrKarton(Number(e.target.value))}
              required
            />

            <input
              type="text"
              placeholder="Назив на проектот/работата"
              value={nazivProekt}
              onChange={(e) => setNazivProekt(e.target.value)}
              required
            />
          </div>

          <div className="form-item-radio">
            <p>Потекло на финансиите:</p>
            <div className="form-radio">
              <label>
                <input
                  type="radio"
                  name="poteklo"
                  value="МФС"
                  checked={poteklo === "Средства на МФС"}
                  onChange={(e) => setPoteklo(e.target.value)}
                />
                Средства на МФС
              </label>
              <label>
                <input
                  type="radio"
                  name="poteklo"
                  value="Буџет"
                  checked={poteklo === "Буџет"}
                  onChange={(e) => setPoteklo(e.target.value)}
                />
                Буџет
              </label>
            </div>
          </div>

          <div className="form-item-inputs">
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
            <div className="form-buttons">
              <div></div>
              <div className="form-buttons-edit">
                {!created ? (
                  <button type="submit">Save</button>
                ) : (
                  <button onClick={updateBaratelNabavka}>Edit</button>
                )}
                {created && (
                  <button onClick={deleteBaratelNabavka}>Delete</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default BaratelNabavka;

import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";
import type { Baratel } from "../../../types/types";

const BaratelNabavka: React.FC = () => {
  const { br_faktura } = useParams<{ br_faktura: string }>();
  const [brKarton, setBrKarton] = useState("");
  const [nazivProekt, setNazivProekt] = useState("");
  const [poteklo, setPoteklo] = useState("");
  const [datum, setDatum] = useState("");
  const [baratelId, setBaratelId] = useState("");
  const [barateli, setBarateli] = useState<Baratel[]>([]);

  useEffect(() => {
    const fetchBarateli = async () => {
      try {
        const response = await axiosClient.get("/barateli/index");
        setBarateli(response.data);
      } catch (error) {
        console.error("Failed to fetch barateli", error);
      }
    };
    fetchBarateli();
  }, []);

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={storeBaratelNabavka}>
        <div className="form-item">
          <h3>Информации за евиденција</h3>

          <div className="form-item-inputs">
            <select
              value={baratelId}
              onChange={(e) => setBaratelId(e.target.value)}
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
              type="text"
              placeholder="Број на картон (Конто)"
              value={brKarton}
              onChange={(e) => setBrKarton(e.target.value)}
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
                  checked={poteklo === "МФС"}
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
            <div className="form-buttons-edit">
              <button type="submit">Save</button>
              <button type="button">Edit</button>
              <button type="button">Delete</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default BaratelNabavka;

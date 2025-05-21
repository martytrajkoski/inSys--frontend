import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { Baratel } from "../../../types/types";
import { useParams } from "react-router-dom";

const BaratelNabavka: React.FC = () => {
  const { br_faktura } = useParams<{ br_faktura: string }>();
  const [brKarton, setBrKarton] = useState("");
  const [nazivProekt, setNazivProekt] = useState("");
  const [poteklo, setPoteklo] = useState("");
  const [datum, setDatum] = useState("");
  const [baratelId, setBaratelId] = useState("");

  const [editMode, setEditMode] = useState(true);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [barateli, setBarateli] = useState<Baratel[]>([]);

  const storeBaratelNabavka = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/baratelNabavka/addDocument", {
        br_faktura: parseInt(br_faktura || "0", 10),
        br_karton: brKarton,
        naziv_proekt: nazivProekt,
        poteklo: poteklo,
        datum: datum,
        baratel_id: baratelId,
        read: true,
      });

      if (response.status === 201) {
        console.log("BaratelNabavka created");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch barateli on mount
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

  const handleSave = async () => {
    const payload = {
      br_faktura: parseInt(br_faktura || "0", 10),
      br_karton: brKarton,
      naziv_proekt: nazivProekt,
      poteklo,
      datum,
      baratel_id: baratelId,
    };

    try {
      if (recordId) {
        await axiosClient.put(
          `/baratelNabavka/addDocument/${recordId}`,
          payload
        );
        alert("Successfully updated.");
      } else {
        const response = await axiosClient.post(
          "/baratelNabavka/addDocument",
          payload
        );
        setRecordId(response.data.id);
        alert("Successfully saved.");
      }
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    try {
      await axiosClient.delete(`/baratelNabavka/addDocument/${recordId}`);
      alert("Deleted.");
      setBrKarton("");
      setNazivProekt("");
      setPoteklo("");
      setDatum("");
      setBaratelId("");
      setRecordId(null);
      setEditMode(true);
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  return (
    <form onSubmit={storeBaratelNabavka}>
      <div className="form-item">
        <h3>Информации за евиденција</h3>

        <div className="form-item-inputs">
          <select
            value={baratelId}
            onChange={(e) => setBaratelId(e.target.value)}
            disabled={!editMode}
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
            disabled={!editMode}
          />

          <input
            type="text"
            placeholder="Назив на проектот/работата"
            value={nazivProekt}
            onChange={(e) => setNazivProekt(e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="form-item-radio">
          <p>Потекло на финансиите:</p>
          <div className="form-radio">
            <div>
              <input
                type="radio"
                name="poteklo"
                value="МФС"
                checked={poteklo === "МФС"}
                onChange={(e) => setPoteklo(e.target.value)}
                disabled={!editMode}
              />
              <label>Средства на МФС</label>
            </div>
            <div>
              <input
                type="radio"
                name="poteklo"
                value="Буџет"
                checked={poteklo === "Буџет"}
                onChange={(e) => setPoteklo(e.target.value)}
                disabled={!editMode}
              />
              <label>Буџет</label>
            </div>
          </div>
        </div>

        <div className="form-item-inputs">
          <input
            type="date"
            placeholder="Датум"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="form-buttons">
          <div></div>
          <div className="form-buttons-edit">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button type="button" onClick={handleDelete} disabled={!recordId}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BaratelNabavka;

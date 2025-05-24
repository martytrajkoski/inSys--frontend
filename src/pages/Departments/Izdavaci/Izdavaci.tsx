import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { Izdavac } from "../../../types/types";
import "../../../styles/pages/departments/table-listing/table-listing.scss"; // 👈 added

const IzdavaciPage: React.FC = () => {
  const [izdavaci, setIzdavaci] = useState<Izdavac[]>([]);
  const [newIzdavac, setNewIzdavac] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");

  const fetchIzdavaci = async () => {
    try {
      const response = await axiosClient.get("/izdavaci");
      setIzdavaci(response.data);
    } catch (error) {
      console.error("Error fetching izdavaci:", error);
    }
  };

  const handleAdd = async () => {
    if (!newIzdavac.trim()) return;
    try {
      await axiosClient.post("/izdavaci", { name: newIzdavac });
      setNewIzdavac("");
      fetchIzdavaci();
    } catch (error) {
      console.error("Error adding izdavac:", error);
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleUpdate = async () => {
    if (editId === null || !editName.trim()) return;
    try {
      await axiosClient.put(`/izdavaci/${editId}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchIzdavaci();
    } catch (error) {
      console.error("Error updating izdavac:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/izdavaci/${id}`);
      fetchIzdavaci();
    } catch (error) {
      console.error("Error deleting izdavac:", error);
    }
  };

  useEffect(() => {
    fetchIzdavaci();
  }, []);

  return (
    <div className="container">
      <h1>Преглед на издавачи</h1>

      <div className="add-section">
        <input
          type="text"
          placeholder="Внеси нов издавач..."
          value={newIzdavac}
          onChange={(e) => setNewIzdavac(e.target.value)}
        />
        <button onClick={handleAdd}>Внеси</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Име</th>
            <th>Акции</th>
          </tr>
        </thead>
        <tbody>
          {izdavaci.map((izdavac) => (
            <tr key={izdavac.id}>
              <td>
                {editId === izdavac.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  izdavac.name
                )}
              </td>
              <td>
                {editId === izdavac.id ? (
                  <button onClick={handleUpdate}>Зачувај</button>
                ) : (
                  <button onClick={() => handleEdit(izdavac.id, izdavac.name)}>
                    Измени
                  </button>
                )}
                <button onClick={() => handleDelete(izdavac.id)}>
                  Избриши
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IzdavaciPage;

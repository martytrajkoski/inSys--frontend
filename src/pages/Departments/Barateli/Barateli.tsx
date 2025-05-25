import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { Baratel } from "../../../types/types";

const BarateliPage: React.FC = () => {
  const [barateli, setBarateli] = useState<Baratel[]>([]);
  const [newBaratel, setNewBaratel] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBarateli = barateli.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchBarateli = async () => {
    try {
      const response = await axiosClient.get("/barateli");
      setBarateli(response.data);
    } catch (error) {
      console.error("Error fetching barateli:", error);
    }
  };

  const handleAdd = async () => {
    if (!newBaratel.trim()) return;
    try {
      await axiosClient.post("/barateli", { name: newBaratel });
      setNewBaratel("");
      fetchBarateli();
    } catch (error) {
      console.error("Error adding baratel:", error);
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleUpdate = async () => {
    if (editId === null || !editName.trim()) return;
    try {
      await axiosClient.put(`/barateli/${editId}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchBarateli();
    } catch (error) {
      console.error("Error updating baratel:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/barateli/${id}`);
      fetchBarateli();
    } catch (error) {
      console.error("Error deleting baratel:", error);
    }
  };

  useEffect(() => {
    fetchBarateli();
  }, []);

  return (
    <div className="mainmenu-content">
      <div className="departments-container">
        <h1>Преглед на баратели на набавка</h1>

        <div className="add-section">
          <input
            type="text"
            placeholder="Пребарај баратели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="add-section">
          <input
            type="text"
            placeholder="Внеси нов барател..."
            value={newBaratel}
            onChange={(e) => setNewBaratel(e.target.value)}
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
            {filteredBarateli.map((baratel) => (
              <tr key={baratel.id}>
                <td>
                  {editId === baratel.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate();
                      }}
                      autoFocus
                    />
                  ) : (
                    baratel.name
                  )}
                </td>
                <td>
                  {editId === baratel.id ? (
                    <button onClick={handleUpdate}>Зачувај</button>
                  ) : (
                    <button onClick={() => handleEdit(baratel.id, baratel.name)}>
                      Измени
                    </button>
                  )}
                  <button onClick={() => handleDelete(baratel.id)}>Избриши</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarateliPage;

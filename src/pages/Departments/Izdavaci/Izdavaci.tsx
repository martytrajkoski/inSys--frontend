import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { Izdavac } from "../../../types/types";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert"; 

const IzdavaciPage: React.FC = () => {
  const [izdavaci, setIzdavaci] = useState<Izdavac[]>([]);
  const [newIzdavac, setNewIzdavac] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const filteredIzdavaci = izdavaci.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
        alert(error.response.data.error || "Овој издавач веќе постои.");
      } else {
        console.error("Error adding izdavac:", error);
        alert("An unexpected error occurred. Please try again.");
      }
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
      alert("Грешка при ажурирање на издавачот.")
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await axiosClient.delete(`/izdavaci/${deleteId}`);
      setDeleteId(null);
      setShowAlert(false);
      fetchIzdavaci();
    } catch (error) {
      alert("Грешка при бришење на издавачот.")
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setShowAlert(false);
  };

  useEffect(() => {
    fetchIzdavaci();
  }, []);

  return (
    <div className="mainmenu-content">
      <div className="departments-container">
        <h1>Преглед на издавачи</h1>

        <div className="add-section">
          <input
            type="text"
            placeholder="Пребарај издавачи..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
            {filteredIzdavaci.map((izdavac) => (
              <tr key={izdavac.id}>
                <td>
                  {editId === izdavac.id ? (
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
                  <button onClick={() => confirmDelete(izdavac.id)}>Избриши</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SweetAlert
        visibility={showAlert}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Дали сте сигурни дека сакате да го избришете издавачот?"
        confirmButton="Избриши"
      />
    </div>
  );
};

export default IzdavaciPage;

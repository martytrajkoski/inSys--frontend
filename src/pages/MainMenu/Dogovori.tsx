import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";

interface Dogovor {
  id: number;
  br_dog: string;
  datum_od_dog: string;
  datum_do_dog: string;
  iznos_dog: number;
  potrosen_iznos: number;
  created_at: string;
  updated_at: string;
}

interface Faktura {
  id: number;
  br_faktura: string;
  scan_file?: string | null;
  status: string;
  created_at: string;
}

const DogovoriPage: React.FC = () => {
  const [dogovori, setDogovori] = useState<Dogovor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedDogovor, setExpandedDogovor] = useState<number | null>(null);
  const [fakturiMap, setFakturiMap] = useState<{ [key: number]: Faktura[] }>({});
  const [role, setRole] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingDogovor, setEditingDogovor] = useState<Dogovor | null>(null);

  const filteredDogovori = dogovori.filter((d) =>
    d.br_dog.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchDogovori = async () => {
    try {
      const response = await axiosClient.get("/dogovori");
      console.log("Dogovori response:", response.data);
      console.log("Dogovori count:", response.data.length);
      setDogovori(response.data);
    } catch (error: any) {
      console.error("Error fetching dogovori:", error);
      // Don't show error to user if table doesn't exist yet
      if (error.response?.status !== 401) {
        console.log("Dogovori table might not exist yet");
      }
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/auth/user");
      if (response.status === 201) {
        console.log("User data:", response.data);
        console.log("Role data:", response.data.role);
        setRole(response.data.role.name);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getRouteByRole = (role: string, br_faktura: string): string => {
    const encoded = encodeURIComponent(br_faktura);
    switch (role) {
      case "Продекан за финансии":
        return `/prodekan/${encoded}`;
      case "Технички секретар":
        return `/tehnickisekretar/${encoded}`;
      case "Јавна набавка":
        return `/tipnabavka/${encoded}`;
      case "Барател на набавка":
        return `/baratelnabavka/${encoded}`;
      case "Сметководство":
        return `/smetkovodstvo/${encoded}`;
      default:
        return "/";
    }
  };

  const fetchFakturiForDogovor = async (dogovorId: number) => {
    try {
      // If already expanded, collapse it
      if (expandedDogovor === dogovorId) {
        setExpandedDogovor(null);
        return;
      }
      
      const response = await axiosClient.get(`/dogovori/${dogovorId}/fakturi`);
      setFakturiMap(prev => ({ ...prev, [dogovorId]: response.data }));
      setExpandedDogovor(dogovorId);
    } catch (error: any) {
      console.error("Error fetching fakturi for dogovor:", error);
    }
  };

  useEffect(() => {
    fetchDogovori();
    fetchUser();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mk-MK');
  };

  const showPdf = (path: string | null | undefined, e: any) => {
    e.preventDefault();
    if (!path) return;
    
    // If path is already a full URL, use it directly
    // Otherwise, construct the storage URL
    const pdfUrl = path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`;
    window.open(pdfUrl, "_blank");
  };

  const openFakturaDetails = (faktura: Faktura) => {
    // Navigate to faktura details in same tab
    const route = getRouteByRole(role, faktura.br_faktura);
    console.log("Navigating to faktura details for role:", role, "faktura:", faktura.br_faktura, "route:", route);
    window.location.href = route;
  };

  const deleteDogovor = async (dogovor: Dogovor) => {
    try {
      const response = await axiosClient.delete(`/dogovori/${dogovor.id}`);
      if (response.status === 200) {
        setDogovori(prev => prev.filter(d => d.id !== dogovor.id));
        alert('Договорот е успешно избришан!');
      }
    } catch (error) {
      console.error('Error deleting dogovor:', error);
      alert('Грешка при бришење на договорот!');
    }
  };

  const editDogovor = (dogovor: Dogovor) => {
    setEditingDogovor(dogovor);
    setShowEditModal(true);
  };

  const updateDogovor = async () => {
    if (!editingDogovor) return;
    
    try {
      const response = await axiosClient.put(`/dogovori/${editingDogovor.id}`, editingDogovor);
      if (response.status === 200) {
        setDogovori(prev => prev.map(d => d.id === editingDogovor.id ? editingDogovor : d));
        setShowEditModal(false);
        setEditingDogovor(null);
        alert('Договорот е успешно ажуриран!');
      }
    } catch (error) {
      console.error('Error updating dogovor:', error);
      alert('Грешка при ажурирање на договорот!');
    }
  };

  return (
    <div className="mainmenu-content">
      <div className="departments-container">
        <h1>Преглед на договори</h1>

        <div className="add-section">
          <input
            type="text"
            placeholder="Пребарај договори..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Број на договор</th>
              <th>Датум од</th>
              <th>Датум до</th>
              <th>Износ</th>
              <th>Потрошен износ</th>
              <th>Акции</th>
            </tr>
          </thead>
          <tbody>
            {filteredDogovori.map((dogovor) => (
              <React.Fragment key={dogovor.id}>
                <tr 
                  onClick={() => fetchFakturiForDogovor(dogovor.id)}
                  style={{ cursor: "pointer", backgroundColor: expandedDogovor === dogovor.id ? "#f0f0f" : "transparent" }}
                >
                  <td>{dogovor.br_dog}</td>
                  <td>{formatDate(dogovor.datum_od_dog)}</td>
                  <td>{formatDate(dogovor.datum_do_dog)}</td>
                  <td>{dogovor.iznos_dog.toLocaleString('mk-MK')}</td>
                  <td>{dogovor.potrosen_iznos.toLocaleString('mk-MK')}</td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editDogovor(dogovor);
                      }}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#28a745",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Измени
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDogovor(dogovor);
                      }}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#dc3545",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Избриши
                    </button>
                  </td>
                </tr>
                
                {expandedDogovor === dogovor.id && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: "#f8f9fa", 
                        borderBottom: "1px solid #ddd",
                        borderRadius: "0 0 8px 8px"
                      }}>
                        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                          Фактури за договор: {dogovor.br_dog}
                        </h4>
                        {fakturiMap[dogovor.id]?.length > 0 ? (
                          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                            <thead>
                              <tr>
                                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Број на фактура</th>
                                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Статус</th>
                                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Датум</th>
                                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Акции</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fakturiMap[dogovor.id].map((faktura: Faktura) => (
                                <tr 
                                  key={faktura.id}
                                  onClick={() => openFakturaDetails(faktura)}
                                  style={{ 
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <td style={{ padding: "8px", borderBottom: "1px solid #eee", width: "25%" }}>{faktura.br_faktura}</td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #eee", width: "25%" }}>
                                    <span style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      backgroundColor: 
                                        faktura.status === 'pending' ? '#fff3cd' :
                                        faktura.status === 'ready' ? '#ffc107' :
                                        faktura.status === 'approved' ? '#198754' : '#6c757d',
                                      color: 'white'
                                    }}>
                                      {faktura.status === 'pending' ? 'Чекање' :
                                       faktura.status === 'ready' ? 'Спремна' :
                                       faktura.status === 'approved' ? 'Запечатена' : 'Непознато'}
                                    </span>
                                  </td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #eee", width: "20%" }}>{formatDate(faktura.created_at)}</td>
                                  <td  style={{ display: "flex", gap: "15px" }}>
                                    {faktura.scan_file && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showPdf(faktura.scan_file, e);
                                          }}
                                          style={{
                                            padding: "5px 15px",
                                            borderRadius: "4px",
                                            border: "none",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            cursor: "pointer",
                                            justifyContent: "center"
                                          }}
                                        >
                                          Види фактура
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ textAlign: 'center', padding: '20px', color: '#666', margin: 0 }}>
                            Нема фактури за овој договор.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredDogovori.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchQuery ? 'Нема договори што одговараат на пребарувањето.' : 'Нема договори во системот.'}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDogovor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h2 style={{ margin: '0 0 20px 0' }}>Уреди договор</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Број на договор:</label>
              <input
                type="text"
                value={editingDogovor.br_dog}
                onChange={(e) => setEditingDogovor({...editingDogovor, br_dog: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Датум од:</label>
              <input
                type="date"
                value={editingDogovor.datum_od_dog}
                onChange={(e) => setEditingDogovor({...editingDogovor, datum_od_dog: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Датум до:</label>
              <input
                type="date"
                value={editingDogovor.datum_do_dog}
                onChange={(e) => setEditingDogovor({...editingDogovor, datum_do_dog: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Износ на договор:</label>
              <input
                type="number"
                value={editingDogovor.iznos_dog}
                onChange={(e) => setEditingDogovor({...editingDogovor, iznos_dog: Number(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>


            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDogovor(null);
                }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Откажи
              </button>
              <button
                onClick={updateDogovor}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Зачувај
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogovoriPage;

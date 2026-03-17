import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";

interface Dogovor {
  id: number;
  br_dog: string;
  datum_od_dog: string;
  datum_do_dog: string;
  iznos_dog: number;
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
  const [selectedDogovor, setSelectedDogovor] = useState<Dogovor | null>(null);
  const [fakturi, setFakturi] = useState<Faktura[]>([]);
  const [role, setRole] = useState<string>("");

  const filteredDogovori = dogovori.filter((d) =>
    d.br_dog.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchDogovori = async () => {
    try {
      const response = await axiosClient.get("/dogovori");
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

  const fetchFakturiForDogovor = async (dogovorId: number, dogovorData: Dogovor) => {
    try {
      const response = await axiosClient.get(`/dogovori/${dogovorId}/fakturi`);
      setFakturi(response.data);
      setSelectedDogovor(dogovorData);
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
    // Open faktura details in new tab
    window.open(getRouteByRole(role, faktura.br_faktura));
  };

  const removeDogovorFromFaktura = async (faktura: Faktura) => {
    try {
      const response = await axiosClient.post(`/dogovori/${faktura.id}/remove-dogovor`);
      
      if (response.status === 200) {
        // Refresh dogovori list to update the UI
        await fetchDogovori();
        alert('Договорот е успешно отстранет од фактурата');
      }
    } catch (error) {
      console.error('Error removing dogovor from faktura:', error);
      alert('Грешка при отстранување на договорот од фактурата');
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
            </tr>
          </thead>
          <tbody>
            {filteredDogovori.map((dogovor) => (
              <tr 
                key={dogovor.id}
                onClick={() => fetchFakturiForDogovor(dogovor.id, dogovor)}
                style={{ cursor: "pointer", backgroundColor: selectedDogovor?.id === dogovor.id ? "#f0f0f" : "transparent" }}
              >
                <td>{dogovor.br_dog}</td>
                <td>{formatDate(dogovor.datum_od_dog)}</td>
                <td>{formatDate(dogovor.datum_do_dog)}</td>
                <td>{dogovor.iznos_dog.toLocaleString('mk-MK')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDogovor && (
          <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Фактури за договор: {selectedDogovor.br_dog}</h3>
            {fakturi.length > 0 ? (
              <table style={{ width: "100%", marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th>Број на фактура</th>
                    <th>Статус</th>
                    <th>Датум</th>
                    <th>Акции</th>
                  </tr>
                </thead>
                <tbody>
                  {fakturi.map((faktura) => (
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
                      <td>{faktura.br_faktura}</td>
                      <td>
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
                           faktura.status === 'ready' ? 'Подготвено' :
                           faktura.status === 'approved' ? 'Одобрено' : 'Непознато'}
                        </span>
                      </td>
                      <td>{formatDate(faktura.created_at)}</td>
                      <td>
                        {faktura.scan_file && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click when clicking button
                                showPdf(faktura.scan_file, e);
                              }}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                marginRight: "5px"
                              }}
                            >
                              Види фактура
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click when clicking button
                                removeDogovorFromFaktura(faktura);
                              }}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "#dc3545",
                                color: "white",
                                cursor: "pointer"
                              }}
                            >
                              Отстрани договор
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Нема фактури за овој договор.
              </p>
            )}
          </div>
        )}

        {filteredDogovori.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchQuery ? 'Нема договори што одговараат на пребарувањето.' : 'Нема договори во системот.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DogovoriPage;

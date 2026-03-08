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

const DogovoriPage: React.FC = () => {
  const [dogovori, setDogovori] = useState<Dogovor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        // Only show error for non-authentication issues
        console.log("Dogovori table might not exist yet");
      }
    }
  };

  useEffect(() => {
    fetchDogovori();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mk-MK');
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
              <tr key={dogovor.id}>
                <td>{dogovor.br_dog}</td>
                <td>{formatDate(dogovor.datum_od_dog)}</td>
                <td>{formatDate(dogovor.datum_do_dog)}</td>
                <td>{dogovor.iznos_dog.toLocaleString('mk-MK')}</td>
              </tr>
            ))}
          </tbody>
        </table>

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

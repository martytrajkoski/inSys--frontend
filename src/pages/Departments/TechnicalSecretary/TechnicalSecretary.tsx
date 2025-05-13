import React, { useState } from "react";
import ImportFile from "../../../components/ImportFile/ImportFile";

const TechnicalSecretary: React.FC = () => {
    const [openImportModal, setopenImportModal] = useState<boolean>(false);

    const handleImportModal = () => {
        setopenImportModal(!openImportModal);
    }

    return(
        <>
            <h3>Основни информации</h3>
            <form action="">
                <div className="form-item">
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Архивски број на влезна фактура 05-12-"/>
                        <input type="text" placeholder="Број на фактура"/>
                        <input type="date" placeholder="Датум"/>
                        <input type="text" placeholder="Издавач на фактура"/>
                        <input type="text" placeholder="Вкупна вредност на фактура (со ДДВ)"/>
                    </div>
                    <div className="form-buttons">
                        <div className="form-button-scan">
                            <button onClick={(e) => {e.preventDefault(); handleImportModal();}}>Скенирај фактура</button>
                            <span>Document.txt</span>
                        </div>
                        <div className="form-buttons-edit">
                            <button>Save</button>
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    </div>
                </div>
            </form>
            {openImportModal && (
                <ImportFile onClose={handleImportModal}/>
            )}
        </>
    )
}

export default TechnicalSecretary;
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const Department: React.FC = () => {
    const navigate = useNavigate();
    const { br_faktura } = useParams<string>();

    return(
        <div className="department">
            <div className="department-title">
                <button onClick={()=>navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/> Назад</button>
                <p>ЗАДОЛЖЕН ПРИЛОГ НА ВЛЕЗНА ФАКТУРА</p>
                <div>Број на фактура: {br_faktura}</div>
            </div>
            <div className="department-container">
                <Outlet/>
            </div>
        </div>
    )
} 

export default Department;
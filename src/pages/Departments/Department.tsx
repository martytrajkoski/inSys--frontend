import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Department: React.FC = () => {
    const navigate = useNavigate();

    return(
        <div className="department">
            <div className="department-title">
                <button onClick={()=>navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/> Назад</button>
                <p>ЗАДОЛЖЕН ПРИЛОГ НА ВЛЕЗНА ФАКТУРА</p>
                <div>Број на фактура</div>
            </div>
            <div className="department-container">
                <Outlet/>
            </div>
        </div>
    )
} 

export default Department;
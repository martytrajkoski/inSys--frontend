import React from "react";

const Header: React.FC = () => {
    return(
        <div className="header">
            <div className="header-info">
                <img src="hehe.png" alt="Logo" />
                <div className="header-title">
                    <p>Универзитет “Св. Кирил и Методиј” во Скопје</p>
                    <p>Машински факултет - Скопје</p>
                </div>
            </div>
            <div className="header-user">
                <p>Petar Petreski</p>
                <button>Одјави се</button>
            </div>
        </div>
    )
}

export default Header;
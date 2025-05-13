import React from "react";
import Header from "../../components/Header/Header";
import { Outlet } from "react-router-dom";

const Home: React.FC = () => {
    return(
        <div>
            <Header />
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default Home;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/Sign/Signup";
import Home from "../pages/Home/Home";
import MainMenu from "../pages/MainMenu/MainMenu";
import Department from "../pages/Departments/Department";
import TechnicalSecretary from "../pages/Departments/TechnicalSecretary/TechnicalSecretary";
import PublicProcurementDepartment from "../pages/Departments/PublicProcurementDepartment/PublicProcurementDepartment";
import ProcurementApplicant from "../pages/Departments/ProcurementApplicant/ProcurementApplicant";
import Accounting from "../pages/Departments/Accounting/Accounting";
import ViceDeanFinance from "../pages/Departments/ViceDeanFinance/ViceDeanFinance";

const AppRoutes: React.FC = () => {
    return(
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/" element={<Home/>}>
                    <Route index element={<MainMenu/>} />
                    <Route element={<Department/>}>
                        <Route path="technicalsecretary" element={<TechnicalSecretary/>}/>
                        <Route path="procurementdepartment" element={<PublicProcurementDepartment/>}/>
                        <Route path="procurementapplicant" element={<ProcurementApplicant/>}/>
                        <Route path="accounting" element={<Accounting/>}/>
                        <Route path="vicedeanfinance" element={<ViceDeanFinance/>}/>
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes;
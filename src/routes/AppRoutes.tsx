import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Sign/Signup";
import SignIn from "../pages/Sign/SignIn";
import Home from "../pages/Home/Home";
import MainMenu from "../pages/MainMenu/MainMenu";
import Department from "../pages/Departments/Department";
import TehnickiSekretar from "../pages/Departments/TehnickiSekretar/TehnickiSekretar";
import TipNabavka from "../pages/Departments/TipNabavka/TipNabavka";
import BaratelNabavka from "../pages/Departments/BaratelNabavka/BaratelNabavka";
import Smetkovodstvo from "../pages/Departments/Smetkovodstvo/Smetkovodstvo";
import Prodekan from "../pages/Departments/Prodekan/Prodekan";
import Barateli from "../pages/Departments/Barateli/Barateli";
import Izdavaci from "../pages/Departments/Izdavaci/Izdavaci";
import PregledFakturi from "../pages/MainMenu/PregledFakturi";
import Arhiva from "../pages/MainMenu/Arhiva";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC = () => {

  const data = JSON.parse(localStorage.getItem("inSys") || '');
  const role = data.role;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
          <Route element={<MainMenu />}>
            <Route index element={<PregledFakturi />} />
            <Route path="lista-barateli" element={<Barateli />} />
            <Route path="lista-izdavaci" element={<Izdavaci />} />
            <Route path="archive" element={<Arhiva />} />
          </Route>

        {/* Department routes */}
          <Route element={<Department />}>
            {role == 1 && (<Route path="prodekan/:br_faktura" element={<Prodekan />} />)}
            {role == 2 && (<Route path="tehnickisekretar" element={<TehnickiSekretar />} />)}
            {role == 2 && (<Route path="tehnickisekretar/:br_faktura" element={<TehnickiSekretar />} />)}
            {role == 3 && (<Route path="tipnabavka/:br_faktura" element={<TipNabavka />} />)}
            {(role == 3 || role == 4) && (<Route path="baratelnabavka/:br_faktura" element={<BaratelNabavka />} />)}
            {role == 5 && (<Route path="smetkovodstvo/:br_faktura" element={<Smetkovodstvo />} />)}
            
          </Route>
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

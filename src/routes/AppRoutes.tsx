import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/Sign/Signup";
import Home from "../pages/Home/Home";
import MainMenu from "../pages/MainMenu/MainMenu";
import Department from "../pages/Departments/Department";
import TehnickiSekretar from "../pages/Departments/TehnickiSekretar/TehnickiSekretar";
import TipNabavka from "../pages/Departments/TipNabavka/TipNabavka";
import BaratelNabavka from "../pages/Departments/BaratelNabavka/BaratelNabavka";
import Smetkovodstvo from "../pages/Departments/Smetkovodstvo/Smetkovodstvo";
import Prodekan from "../pages/Departments/Prodekan/Prodekan";
import SignIn from "../pages/Sign/SignIn";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />}>
          <Route index element={<MainMenu />} />
          <Route element={<Department />}>
            <Route path="tehnickisekretar" element={<TehnickiSekretar />} />
            <Route path="baratelnabavka/:br_faktura" element={<BaratelNabavka />} />
            <Route path="tipnabavka" element={<TipNabavka />} />
            <Route path="smetkovodstvo" element={<Smetkovodstvo />} />
            <Route path="prodekan" element={<Prodekan />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

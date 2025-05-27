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
import Barateli from "../pages/Departments/Barateli/Barateli";
import Izdavaci from "../pages/Departments/Izdavaci/Izdavaci";
import PregledFakturi from "../pages/MainMenu/PregledFakturi";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />}>
          <Route element={<MainMenu />}>
            <Route index element={<PregledFakturi/>}/>
            <Route path="lista-barateli" element={<Barateli />} />
            <Route path="lista-izdavaci" element={<Izdavaci />} />
          </Route>
          <Route element={<Department />}>
            <Route path="tehnickisekretar" element={<TehnickiSekretar br_faktura={""} />} />
            <Route path="baratelnabavka/:br_faktura" element={<BaratelNabavka />} />
            <Route path="tipnabavka/:br_faktura" element={<TipNabavka />} />
            <Route path="smetkovodstvo/:br_faktura" element={<Smetkovodstvo />} />
            <Route path="prodekan/:br_faktura" element={<Prodekan />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Sign/Signup";
import SignIn from "../pages/Sign/SignIn";
import Home from "../pages/Home/Home";
import MainMenu from "../pages/MainMenu/MainMenu";
import Department from "../pages/Departments/Department";
import TehnickiSekretar from "../pages/Departments/TehnickiSekretar/TehnickiSekretar";
import TipNabavka from "../pages/Departments/TipNabavka/TipNabavka";
import Smetkovodstvo from "../pages/Departments/Smetkovodstvo/Smetkovodstvo";
import Prodekan from "../pages/Departments/Prodekan/Prodekan";
import Izdavaci from "../pages/Departments/Izdavaci/Izdavaci";
import PregledFakturi from "../pages/MainMenu/PregledFakturi";
import Arhiva from "../pages/MainMenu/Arhiva";
import Pdf from "../pages/PDF/Pdf";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PregledFakturaFilter from "../pages/MainMenu/PregledFakturaFilter";

const AppRoutes: React.FC = () => {
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
            <Route path="lista-izdavaci" element={<Izdavaci />} />
            <Route path="archive" element={<Arhiva />} />
            <Route path="fakturipoizdavac" element={<PregledFakturaFilter />} />
          </Route>

          {/* Department routes */}
          <Route element={<Department />}>
            <Route element={<RoleProtectedRoute allowedRoles={[1]} />}>
              <Route path="prodekan/:br_faktura" element={<Prodekan />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={[2]} />}>
              <Route path="tehnickisekretar" element={<TehnickiSekretar />} />
              <Route path="tehnickisekretar/:br_faktura" element={<TehnickiSekretar />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={[3]} />}>
              <Route path="tipnabavka/:br_faktura" element={<TipNabavka />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={[5]} />}>
              <Route path="smetkovodstvo/:br_faktura" element={<Smetkovodstvo />} />
            </Route>
          </Route>
          <Route path="pdf/:br_faktura" element={<Pdf />} />
        </Route>
        {/* Default route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

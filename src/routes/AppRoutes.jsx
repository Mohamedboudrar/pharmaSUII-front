import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import PharmacyDetailsPage from "../pages/PharmacyDetailsPage";
import PrescriptionsPage from "../pages/PrescriptionsPage";
import PrescriptionDetailsPage from "../pages/PrescriptionDetailsPage";
import UploadPage from "../pages/UploadPage";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/Protectedroute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pharmacy/:id" element={<PharmacyDetailsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetailsPage />} />
          <Route path="/upload/:id" element={<UploadPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

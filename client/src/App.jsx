import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import OutletConflictModal from './components/common/OutletConflictModal';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import OutletsPage from './pages/public/OutletsPage';
import OutletMenuPage from './pages/public/OutletMenuPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Student Pages
import CartPage from './pages/student/CartPage';
import CheckoutPage from './pages/student/CheckoutPage';
import OrderTrackingPage from './pages/student/OrderTrackingPage';
import MyOrdersPage from './pages/student/MyOrdersPage';

// Vendor Pages
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import VendorMenuPage from './pages/vendor/VendorMenuPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#250001]">
            <Navbar />
            <OutletConflictModal />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/outlets" element={<OutletsPage />} />
                <Route path="/outlets/:id" element={<OutletMenuPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Protected Student Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'VENDOR', 'ADMIN']}>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Vendor Routes */}
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['VENDOR']}>
                      <VendorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <ProtectedRoute allowedRoles={['VENDOR']}>
                      <VendorOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/menu"
                  element={
                    <ProtectedRoute allowedRoles={['VENDOR']}>
                      <VendorMenuPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Utility Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

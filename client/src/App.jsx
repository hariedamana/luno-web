import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';


// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Modes from './pages/Modes';
import ModeDetail from './pages/ModeDetail';
import Sessions from './pages/Sessions';
import Device from './pages/Device';
import Buy from './pages/Buy';
import Cart from './pages/Cart';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDevices from './pages/admin/AdminDevices';
import AdminRecordings from './pages/admin/AdminRecordings';
import AdminAI from './pages/admin/AdminAI';
import AdminModes from './pages/admin/AdminModes';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminStorage from './pages/admin/AdminStorage';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminHelp from './pages/admin/AdminHelp';

import './index.css';

// Animated Routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/modes" element={<Modes />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Protected Routes */}
        <Route
          path="/modes/:slug"
          element={
            <ProtectedRoute>
              <ModeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/device"
          element={
            <ProtectedRoute>
              <Device />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="devices" element={<AdminDevices />} />
          <Route path="recordings" element={<AdminRecordings />} />
          <Route path="ai" element={<AdminAI />} />
          <Route path="modes" element={<AdminModes />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="storage" element={<AdminStorage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="help" element={<AdminHelp />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AnimatedRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

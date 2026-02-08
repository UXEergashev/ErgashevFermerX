import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import Land from './pages/Land';
import Finance from './pages/Finance';
import Warehouse from './pages/Warehouse';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Trash from './pages/Trash';

// Components
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <PublicRoute>
                                        <Register />
                                    </PublicRoute>
                                }
                            />

                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Dashboard />} />
                                <Route path="crops" element={<Crops />} />
                                <Route path="land" element={<Land />} />
                                <Route path="finance" element={<Finance />} />
                                <Route path="warehouse" element={<Warehouse />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="trash" element={<Trash />} />
                            </Route>

                            {/* Catch all - redirect to dashboard */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;

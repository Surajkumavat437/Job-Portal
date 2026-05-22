import React from 'react'
import { useAuth } from '../../context/AuthContext.js'
import { Navigate, Outlet } from 'react-router-dom' // Added Outlet here!
import Spinner from '../ui/Spinner.jsx'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) return <Spinner />;
    if (!isAuthenticated) return <Navigate to='/login' replace />;

    // ROLE CHECK: If the page requires a role the user doesn't have
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return user?.role === 'recruiter' 
            ? <Navigate to='/admin/dashboard' replace /> 
            : <Navigate to='/home' replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
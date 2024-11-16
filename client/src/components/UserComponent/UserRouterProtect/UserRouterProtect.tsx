import React from 'react'
import { Navigate } from 'react-router-dom';



const ProtectedRoutes = ({ children }:any) => {

   const userEmail = localStorage.getItem('userEmail')

    if (!userEmail) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoutes
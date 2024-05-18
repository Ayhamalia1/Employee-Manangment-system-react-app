import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
    let Auth= localStorage.getItem('isLogged');
  return (
    Auth === 'true' ? <Outlet/>:<Navigate to="/"/> 
  )
}

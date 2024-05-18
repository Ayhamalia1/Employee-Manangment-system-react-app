import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Component/Login/Login'
import Dashboard from './Component/Dashboard/Dashboard'
import ReviewVacation from './Review_Request_Vacation/ReviewVacation'
import CreateAccount from './Component/Create_Employee_Account/CreateAccount'
import QR from './Component/QR_Code/QR'
import ActiveUsers from './Component/Active_Users/ActiveUsers'
import UpdateUsers from './Component/Update_Users_Data/UpdateUsers'
import NotFound from './Component/NotFound/NotFound'
import Loader from './Component/Loader/Loader';
import ProtectedRoutes from './Component/ProtectedRoutes/ProtectedRoutes'
import Edit_IPAddress from './Component/Edit_IPAddress/Edit_IPAddress'
import Archive from './Component/Archive/Archive'
import axios from 'axios'
import Reports from './Component/Reports/Reports'
import EmployeeReport from './Component/EmployeeReport/EmployeeReport'


export default function App() {
  let Navigate=useNavigate();
  let token=localStorage.getItem('token');
  let [employees,setEmployees]=useState([]);
  let [loading,setLoading]=useState(false);
  let [TotalPages, setTotalPages] = useState();
  let [numPage, setNumPage] = useState();

  //Pagination
  const handlePageChange = (data) => {
    setNumPage(data.selected + 1);
    getEmployees(data.selected + 1); 
 };
  //get all Employee
  const getEmployees=async(curr)=>{
    let {data}=await axios.get("https://staff-scanner.vercel.app/company/getEmployees",{headers:{"Authorization":`Bearer ${token}`},params: {
      page: curr,
      perPage:7,
    }})
    setEmployees(data.employees);
    setTotalPages(data.totalPages);
    setLoading(false);
  }
  // to Logout
  function logout(){
    localStorage.removeItem("token");
    localStorage.setItem("isLogged", false);
    Navigate("/login");
  }
  //update when do an action employee
  function updateEmployees(num){
    getEmployees(num);
  }
  // to show employees
  useEffect(()=>{
    if(token!=""){
    getEmployees();
    }
  }, []);
  return (
<>
{loading ?(<Loader/>):(
<Routes>
  <Route element={<ProtectedRoutes/>}>
  <Route path='Dashboard' element={<Dashboard logout={logout} employees={employees} handlePageChange={handlePageChange} TotalPages={TotalPages}
    numPage={numPage} updateEmployees={updateEmployees}/>}></Route>
  <Route path='ReviewVacation' element={<ReviewVacation logout={logout}/>}></Route>
  <Route path='EditIPAddress' element={<Edit_IPAddress logout={logout}/>}></Route>
  <Route path='CreateAccount' element={<CreateAccount logout={logout}/>}></Route>
  <Route path='Archive' element={<Archive logout={logout}/>}></Route>
  <Route path='QRcode' element={<QR logout={logout}/>}></Route>
  <Route path='ActiveUsers' element={<ActiveUsers logout={logout}/>}></Route>
  <Route path='UpdateUsers/:id' element={<UpdateUsers logout={logout}  updateEmployees={updateEmployees} numPage={numPage}/>}></Route>
  <Route path='Reports' element={<Reports logout={logout}/>} ></Route>
  <Route path='EmployeeReport/:id' element={<EmployeeReport logout={logout}/>}></Route>
  </Route>
 <Route path='/' element={<Login /> } ></Route>
 <Route path='*' element={<NotFound/>}></Route>
</Routes>
)}
</>
  )
}

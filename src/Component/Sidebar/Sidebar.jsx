import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function Sidebar({logout}) {
  return (
    <div>
<div className="sidebar">
  <div className="ActionsMenu">
          <NavLink  className={({ isActive, isPending }) =>`item d-flex  ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/Dashboard" >              
          <i class="fa-solid fa-desktop"></i>
          <p className=''>Dashboard</p>  
          </NavLink>
         <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/ReviewVacation"> 
         <i class="fa-regular fa-eye"></i>      
          <p>Review Vacation Request</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/CreateAccount">       
          <i class="fa-solid fa-user-plus"></i>
          <p>Create Employee Account</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/QRcode">       
          <i class="fa-solid fa-qrcode"></i>
          <p>QR Code</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/ActiveUsers">       
          <i class="fa-solid fa-user-check"></i>
          <p>Active users</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/Archive">       
          <i class="fa-solid fa-box-archive"></i>
          <p>Archive Vacations</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`}  aria-current="page" to="/EditIPAddress">       
          <i class="fa-solid fa-wifi"></i>
          <p>Edit IP Address</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`}  aria-current="page" to="/Reports">       
          <i class="fa-solid fa-file-export"></i>
          <p>Reports</p>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>`item d-flex ${isPending ? "pending" : isActive ? "Active" : ""}`} aria-current="page" to="/" onClick={logout}>       
          <i class="fa-solid fa-right-from-bracket"></i>
          <p >Log out</p>
          </NavLink>
  </div>
  <svg className="shape3" xmlns="http://www.w3.org/2000/svg" width="136" height="127" viewBox="0 0 136 127" fill="none">
  <g opacity="0.3">
    <path d="M104.067 11.9499C87.101 -13.0452 54.6204 -20.5964 31.5198 -4.91609C8.41926 10.7642 3.44643 43.7381 20.4127 68.7332C37.3789 93.7283 69.8595 101.279 92.9601 85.5992C116.061 69.9189 121.033 36.945 104.067 11.9499Z" stroke="#0D4C92" stroke-width="0.998"/>
    <path d="M116.485 69.6896C107.162 55.9548 89.32 51.8013 76.634 60.4123C63.9479 69.0234 61.2216 87.1383 70.5445 100.873C79.8674 114.608 97.7092 118.761 110.395 110.15C123.081 101.539 125.808 83.4244 116.485 69.6896Z" stroke="#0D4C92" stroke-width="0.998"/>
  </g>
</svg>
<svg className="shape1" xmlns="http://www.w3.org/2000/svg" width="125" height="709" viewBox="0 0 125 709" fill="none">
  <path opacity="0.8" d="M42.782 374.037C42.782 500.403 111.989 732.169 -3.01801 732.169C-118.025 732.169 -287.958 500.403 -287.958 374.037C-287.958 247.671 -32.816 0.689941 82.194 0.689941C197.204 0.689941 42.782 247.67 42.782 374.037Z" fill="#CFF5E7"/>
</svg>
<svg className="shape2" xmlns="http://www.w3.org/2000/svg" width="337" height="168" viewBox="0 0 337 168" fill="none">
  <path opacity="0.8" d="M346.247 45.847C440 120.9 497.995 163.69 431.137 268.932C226.684 515.509 42.7459 161.67 -51.0071 86.619C-144.76 11.568 114.658 200.08 181.515 94.838C248.372 -10.404 252.494 -29.2 346.247 45.847Z" fill="#0D4C92" fill-opacity="0.44"/>
</svg>
</div>

    </div>
  )
}

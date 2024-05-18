import React, { useState } from 'react'
import img from "../images/OBJECTS 1.png";
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../Loader/Loader';
export default function Login() {

  let [Company,setCompany] = useState({
    email:"",
    password:""
});
  let [loading,setLoading] = useState(false);
  let [errorList,setErrorList] = useState([]);
   const navigate=useNavigate();
  //Function to get data from Form
  function getData(e){
    const newCompany = {
      ...Company,
      [e.target.name]: e.target.value
  };
  setCompany(newCompany);
  };
//function to submit form
const SubmitForm = async (e) =>{
  e.preventDefault();
  setLoading(true);
 let validationRes= ValidationForLogin(Company);
 if(validationRes.error){
 setErrorList(validationRes.error.details);
 setLoading(false);
}
 else{
  setErrorList([]);
  try{
    let {data}=await axios.post("https://staff-scanner.vercel.app/auth/signinCompany",Company)
    if(data.message=="success you are company"){
      setLoading(false);
       localStorage.setItem("token",data.token);
       localStorage.setItem("isLogged",true);
       navigate("/Dashboard")
     } 
     }
  catch(e){
    setLoading(false);
    if(e.response.data.message!=="validation error"){
      Swal.fire({
        title:  e.response.data.message,
        icon: 'error',
        customClass: {
          title: 'my-custom-title',
        },
        showCloseButton: true,
        showConfirmButton: false
      });
    }
    else{
      Swal.fire({
        title:  e.response.data.validationArray[0][0].message,
        icon: 'error',
        customClass: {
          title: 'my-custom-title',
        },
        showCloseButton: true,
        showConfirmButton: false
      });
    }
  }
 }

}
//validation for login 
function ValidationForLogin(Company){
  const schema=Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required(),
    password:Joi.string().min(6).max(20).required()
  })
  return schema.validate(Company,{abortEarly:false});
}
  return (
    <>
    {loading ? (<Loader/>):(
    <div className="Login ">
  <div className="leftSide">
    <img src={img}/>
  </div>
<form onSubmit={SubmitForm}>
<div className="rightSide">
    <h2>Welome Back</h2>
    <h3>Log in</h3>
    <div className="inputs">
      <div className="row">
        <div className="col-4 ">
          <label>E-mail</label>
        </div>
        <div className="col-4 ">
          <input className="input1"  onChange={getData} value={Company.email}  name="email" type="email" placeholder="UserEmail@gmail.com" />
        </div>
        <div className="col-4 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <     path d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z" fill="#0D4C92"/>
          </svg>
        </div>
      </div>
    </div>
    <div className="inputs ">
      <div className="row">
        <div className="col-4">
          <label className=''>Password</label>
        </div>
        <div className="col-4">
          <input className="in" type="password"  value={Company.password}  onChange={getData} name="password" placeholder="................." />
        </div>
        <div className="col-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M12 17C12.5304 17 13.0391 16.7893 13.4142 16.4142C13.7893 16.0391 14 15.5304 14 15C14 14.4696 13.7893 13.9609 13.4142 13.5858C13.0391 13.2107 12.5304 13 12 13C11.4696 13 10.9609 13.2107 10.5858 13.5858C10.2107 13.9609 10 14.4696 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17ZM18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V10C4 9.46957 4.21071 8.96086 4.58579 8.58579C4.96086 8.21071 5.46957 8 6 8H7V6C7 4.67392 7.52678 3.40215 8.46447 2.46447C9.40215 1.52678 10.6739 1 12 1C12.6566 1 13.3068 1.12933 13.9134 1.3806C14.52 1.63188 15.0712 2.00017 15.5355 2.46447C15.9998 2.92876 16.3681 3.47995 16.6194 4.08658C16.8707 4.69321 17 5.34339 17 6V8H18ZM12 3C11.2044 3 10.4413 3.31607 9.87868 3.87868C9.31607 4.44129 9 5.20435 9 6V8H15V6C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3Z" fill="#0D4C92"/>
         </svg>
        </div>
      </div>
    </div>
    <div className="d-flex justify-content-between Remember">
      <div className>
        <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" defaultChecked />
        <label className="form-check-label" htmlFor="flexCheckChecked">
          Remember me
        </label>
      </div>
      <a href="#">Forget Password?</a>
    </div>
    {
   errorList.length > 0 && errorList.map((error,index) =>
    <div className=' message alert alert-danger my-1' key={index} >{error.message}</div>
    )
    }
    <div className=" LoginBtn d-grid ">
      <button type="submit" className='position-fixed '>Login</button>
    </div>
  </div> 
</form>
</div>)}

    </>
  )
}

import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Joi from 'joi';
import { Message } from 'primereact/message';
import Swal from 'sweetalert2';
export default function UpdateUsers({numPage,updateEmployees}) {
  const token=localStorage.getItem('token');
  const {id} =useParams();
  let [Account,setAccount]=useState({
  });
  let [errorList,setErrorList]=useState({});
  const Navigate=useNavigate('');
  //close button
function back(){
  Navigate('/Dashboard');
}
  //Function get Form data
  function getAccountData(e){
    let{value,name}=e.target;
    const validation=validateInputs(value,schema.extract(name));
    if(validation.error){
      setErrorList({...errorList,[name]:validation.error.details[0].message});
    }
    else{
      const err={...errorList};
      delete err[name];
      setErrorList({...err});
    }
    if (value === "") {
      const updatedAccount = { ...Account };
      delete updatedAccount[name]; // Remove the key from the object
      setAccount(updatedAccount);
    } else {
      setAccount({ ...Account, [name]: value });
    }
    }
  //function to submit updates 
  async function  Submit(e){
    e.preventDefault();
      if(Object.keys(errorList).length===0){
        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
        }).then(async(result) => {
          /* Read more about isConfirmed, isDenied below */
          try{
          if (result.isConfirmed) {
            let {data}=await axios.put(`https://staff-scanner.vercel.app/company/updateEmployee/${id}`,Account,{headers:{"Authorization":`Bearer ${token}`}})
            Swal.fire('Updated!', '', 'success','1500');
            Navigate("/Dashboard");
            updateEmployees(numPage);
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
          }

        }catch(e){
          if(e.response.data.message!=="validation error"){
            Swal.fire({
              title:  e.response.data.message,
              icon: 'error',
              customClass: {
                title: 'my-custom-title',
                confirmButton: 'my-custom-button',
              },
            });
          }
          else{
            Swal.fire({
              title:  e.response.data.validationArray[0][0].message,
              icon: 'error',
              customClass: {
                title: 'my-custom-title',
                confirmButton: 'my-custom-button',
              },
            });
          }
         }
      }
        )

       }
    }
// Validation for maching Passwords

//validation
const schema=Joi.object({
  fullName:Joi.string().allow(''),
  phoneNumber:Joi.string().pattern(new RegExp(/^\+970\d{9}$/)).messages({
    "string.pattern.base":"Phone Number must start with +970"
  }).allow(''),
  password:Joi.string().min(6).max(20).allow(''),
  userName:Joi.string().pattern(/^\S*$/).messages({
    "string.pattern.base":"User Name must not contains space"
  }).allow(''),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).allow(''),
  deviceId:Joi.string().allow('').max(16),
  startChecking:  Joi.string().allow(''),
  endChecking:Joi.string().allow(''),
  cPassword:Joi.string().allow(''),
});
const validateInputs =(input,inputSchema) => {
  return inputSchema.validate(input);
};
  return (
    <>
<div className="UpdateForm">
  <div className="form ">
    <h3>Update Employee Account</h3>
    <svg onClick={back} xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 40 40" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.2418 6.69503C17.3982 6.12347 22.602 6.12347 27.7584 6.69503C30.6134 7.01503 32.9168 9.26336 33.2518 12.1284C33.8633 17.3578 33.8633 22.6406 33.2518 27.87C33.0822 29.2622 32.4475 30.5562 31.4504 31.5424C30.4533 32.5286 29.1523 33.1491 27.7584 33.3034C22.6021 33.8767 17.3981 33.8767 12.2418 33.3034C10.8478 33.1491 9.54688 32.5286 8.54979 31.5424C7.5527 30.5562 6.91794 29.2622 6.74842 27.87C6.13692 22.6412 6.13692 17.3589 6.74842 12.13C6.91787 10.7381 7.55239 9.44427 8.54914 8.4581C9.5459 7.47194 10.8465 6.85127 12.2401 6.6967L12.2418 6.69503ZM14.1168 14.1167C14.3511 13.8826 14.6688 13.7511 15.0001 13.7511C15.3313 13.7511 15.649 13.8826 15.8834 14.1167L20.0001 18.2334L24.1168 14.1167C24.2312 13.9939 24.3692 13.8954 24.5225 13.8271C24.6759 13.7587 24.8414 13.722 25.0092 13.719C25.1771 13.7161 25.3438 13.747 25.4994 13.8098C25.6551 13.8727 25.7965 13.9663 25.9152 14.085C26.0339 14.2037 26.1274 14.3451 26.1903 14.5007C26.2532 14.6563 26.284 14.8231 26.2811 14.9909C26.2781 15.1587 26.2414 15.3243 26.1731 15.4776C26.1047 15.6309 26.0062 15.7689 25.8834 15.8834L21.7668 20L25.8834 24.1167C26.1042 24.3537 26.2244 24.6671 26.2187 24.9909C26.213 25.3147 26.0818 25.6237 25.8528 25.8527C25.6238 26.0818 25.3148 26.2129 24.991 26.2187C24.6671 26.2244 24.3537 26.1042 24.1168 25.8834L20.0001 21.7667L15.8834 25.8834C15.769 26.0062 15.631 26.1047 15.4777 26.173C15.3243 26.2413 15.1588 26.2781 14.991 26.281C14.8231 26.284 14.6564 26.2531 14.5008 26.1902C14.3451 26.1274 14.2037 26.0338 14.085 25.9151C13.9663 25.7964 13.8728 25.655 13.8099 25.4994C13.747 25.3437 13.7161 25.177 13.7191 25.0092C13.7221 24.8413 13.7588 24.6758 13.8271 24.5225C13.8954 24.3691 13.9939 24.2311 14.1168 24.1167L18.2334 20L14.1168 15.8834C13.8827 15.649 13.7512 15.3313 13.7512 15C13.7512 14.6688 13.8827 14.3511 14.1168 14.1167Z" fill="#0D4C92" />
    </svg>
  </div>
  <div className="forminputs">
        <form onSubmit={Submit}>
          <div className="row">
            <div className="col-md-6 position-relative">
              <div className='d-flex '>
              <label className="form-label" >FULL NAME<span>*</span> </label>
                 {errorList.fullName && (<div className='pb-1 Message '><Message  severity="error" text={errorList.fullName} /></div>)}
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="text" className="ps-2 " placeholder="Enter the full name"  name='fullName' onChange={getAccountData} />
                <svg className="mt-3" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>
            <div className="col-md-6 position-relative">
              <label className="form-label">DEVICE ID<span className="Opt">(optional)</span> </label>
              <div className="mb-3 d-flex createInputs ">
                <input type="text" className="ps-2" placeholder="Enter the DEVICE ID"  name='deviceId' onChange={getAccountData}/>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.3283 14.4353 9.65339 14.3097 9.95671C14.1841 10.26 13.9999 10.5356 13.7678 10.7678C13.5356 10.9999 13.26 11.1841 12.9567 11.3097C12.6534 11.4353 12.3283 11.5 12 11.5ZM12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>

            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">PHONE NUMBER<span>*</span></label>
              {errorList.phoneNumber && (<div className='text-danger pb-1 Message'><Message  severity="error" text={errorList.phoneNumber} /></div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="tel" className="ps-2" placeholder={+9705998822334} name='phoneNumber' onChange={getAccountData} />
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#9A9A9A" />
                </svg>
              </div>

            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">Enter email address<span>*</span></label>
              {errorList.email && (<div className='text-danger pb-1  Message'><Message  severity="error" text={errorList.email} /> </div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="email" className="ps-2" placeholder="Enter mail address" name='email' onChange={getAccountData} />
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#9A9A9A" />
                </svg>
              </div>

            </div>
            <div className="col-md-6 ">
              <div className="d-flex">
              <label className="form-label">PASSWORD<span>*</span></label>
              {errorList.password && (<div className='text-danger pb-1  ps-4'> <Message  severity="error" text={errorList.password} /></div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="password" className="ps-2" placeholder="Enter the password" name='password' onChange={getAccountData} />
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C12.5304 17 13.0391 16.7893 13.4142 16.4142C13.7893 16.0391 14 15.5304 14 15C14 14.4696 13.7893 13.9609 13.4142 13.5858C13.0391 13.2107 12.5304 13 12 13C11.4696 13 10.9609 13.2107 10.5858 13.5858C10.2107 13.9609 10 14.4696 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17ZM18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V10C4 9.46957 4.21071 8.96086 4.58579 8.58579C4.96086 8.21071 5.46957 8 6 8H7V6C7 4.67392 7.52678 3.40215 8.46447 2.46447C9.40215 1.52678 10.6739 1 12 1C12.6566 1 13.3068 1.12933 13.9134 1.3806C14.52 1.63188 15.0712 2.00017 15.5355 2.46447C15.9998 2.92876 16.3681 3.47995 16.6194 4.08658C16.8707 4.69321 17 5.34339 17 6V8H18ZM12 3C11.2044 3 10.4413 3.31607 9.87868 3.87868C9.31607 4.44129 9 5.20435 9 6V8H15V6C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">Repeat Password<span>*</span></label>
              <div className='d-flex no-warp'>
              </div>
                             
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="password" className="ps-2" placeholder="Repeat Password" id="Repeat Password" name='cPassword' onChange={getAccountData}/>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C12.5304 17 13.0391 16.7893 13.4142 16.4142C13.7893 16.0391 14 15.5304 14 15C14 14.4696 13.7893 13.9609 13.4142 13.5858C13.0391 13.2107 12.5304 13 12 13C11.4696 13 10.9609 13.2107 10.5858 13.5858C10.2107 13.9609 10 14.4696 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17ZM18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V10C4 9.46957 4.21071 8.96086 4.58579 8.58579C4.96086 8.21071 5.46957 8 6 8H7V6C7 4.67392 7.52678 3.40215 8.46447 2.46447C9.40215 1.52678 10.6739 1 12 1C12.6566 1 13.3068 1.12933 13.9134 1.3806C14.52 1.63188 15.0712 2.00017 15.5355 2.46447C15.9998 2.92876 16.3681 3.47995 16.6194 4.08658C16.8707 4.69321 17 5.34339 17 6V8H18ZM12 3C11.2044 3 10.4413 3.31607 9.87868 3.87868C9.31607 4.44129 9 5.20435 9 6V8H15V6C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>

            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">STAR CHEKING<span>*</span></label>
              {errorList.startChecking && (<div className=' pb-1 Message'> <Message severity="error" text={errorList.startChecking} />
 </div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="time" className="ps-2" placeholder="8:0000" name='startChecking' onChange={getAccountData} />
              </div>
              
            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">END CHEKING<span>*</span></label>
              {errorList.endChecking && (<div className='\ pb-1 Message'><Message  severity="error" text={errorList.endChecking}  /> </div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="time" className="ps-2" placeholder="8:00"   name='endChecking' onChange={getAccountData}/>
              </div>

            </div>
  
            <div className="col-md-6 ">
            <button type='submit' className=''>Save</button>
            </div>
          </div>
        </form>
      </div>
</div>
    </>
  )
}

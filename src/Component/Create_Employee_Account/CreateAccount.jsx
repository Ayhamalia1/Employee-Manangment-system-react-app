import React, { useState , useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import img from "../images/Ellipse 13.png";
import Joi from 'joi';
import axios from 'axios';
import { Message } from 'primereact/message';
import Swal from 'sweetalert2';
import Loader from '../Loader/Loader';

        
export default function CreateAccount(props) {
  const token=localStorage.getItem('token');
  let [Account,setAccount]=useState({
    fullName:"",
    phoneNumber:"",
    password:"",
    cPassword:"",
    userName:"",
    email:"",
    startChecking:"",
    endChecking:"",
  });
  let [errorList,setErrorList]=useState({
    fullName:"",
    phoneNumber:"",
    password:"",
    userName:"",
    email:"",
    startChecking:"",
    endChecking:"",
    cPassword:"",
  });
  let copy={ cPassword:""};
  let [loading,setLoading]=useState(true);
  //for Loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, []);
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
      setAccount({...Account,[name]:value});
  }
// Validation for maching Passwords
  if(Account.password !== Account.cPassword && Account.cPassword.length !== 0){
    copy.cPassword="cPassword not mathing";}
 else{
   copy.cPassword="";
 }
  //function to submit  
  async function  Submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      if(Object.keys(errorList).length===0 && Object.values(copy)[0]===""){ 
        let {data}= await axios.post("https://staff-scanner.vercel.app/company/createEmployee",Account,{headers:{"Authorization":`Bearer ${token}`}});
          if(data.message=="Employee added successfully"){
            setLoading(false);
            setAccount({})
            Swal.fire({
              position: 'top-center',
              icon: 'success',
              html: `
              <div className="sucssesMsg">
               <p class="sucssesMsg">${data.message}</p>
              </div>`,
              showConfirmButton: false,
              timer: 1500
            })
          }
       }
       else{
        setLoading(false);
        Swal.fire({
          icon: 'error',
          html: `
          <div className="errorMsg">
           <p class="errorMsg">Values is not allowed to be empty</p>
          </div>`,
          customClass: {
            title: 'my-custom-title',
            confirmButton: 'my-custom-button',
          },
        });
       }
      }
      catch (e) {
        setLoading(false);

        if (e.response.data.message !== "validation error") {
          Swal.fire({
            html: `
            <div className="errorMsg">
             <p class="errorMsg">${e.response.data.message}</p>
            </div>`,
            icon: 'error',
            customClass: {
              text: 'my-custom-text',
              confirmButton: 'my-custom-button',
              content: 'my-content-class',
            },
          });
        }
        else {
          Swal.fire({
            html: `
            <div className="errorMsg">
             <p class="errorMsg">${e.response.data.validationArray[0][0].message}</p>
            </div>`,
            icon: 'error',
            customClass: {
              title: 'my-custom-title',
              confirmButton: 'my-custom-button',
            },
          });
        }
      }}
  //Validation
  const schema=Joi.object({
    fullName:Joi.string().required(),
    phoneNumber:Joi.string().pattern(new RegExp(/^\+970\d{9}$/)).required().messages({
      "string.pattern.base":"Phone Number must start with +970"
    }),
    password:Joi.string().min(6).max(20).required(),
    userName:Joi.string().pattern(/^\S*$/).required().messages({
      "string.pattern.base":"User Name must not contains space"
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required(),
    deviceId:Joi.string(),
    startChecking:  Joi.string().required(),
    endChecking:Joi.string().required(),
    cPassword:Joi.string().required(),
  });
  const validateInputs =(input,inputSchema) => {
    return inputSchema.validate(input);
  };
  return (
    <>
    {loading ?(<Loader/>):(
    <div className='d-flex overflow-x-hidden'>
        <Sidebar logout={props.logout}/>
<div className="DashSide ">
  <div className="WelcomeSection">
    <div className="Content d-flex">
      <img src={img} />
      <div className="Head">
        <h2>Welcome Company !</h2>
        <p>Start your work now</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width={35} height={34} viewBox="0 0 35 34" fill="none">
        <path d="M3.07574 17.728L11.5217 22.0418C11.7715 22.1667 12.3164 22.4732 12.6229 21.9737C12.9067 21.5083 12.4299 21.1336 12.2028 20.9634L2.3719 13.4369C1.65672 12.8693 1.49779 11.7681 2.04269 11.0189C2.58759 10.2356 3.72281 10.0086 4.49475 10.5421L14.4846 17.7053C14.6663 17.8415 15.1658 18.2048 15.529 17.7848C15.8923 17.3874 15.495 16.9333 15.336 16.7631L6.06134 6.97753C5.39157 6.23964 5.43698 5.01361 6.3338 4.18491C7.04898 3.52648 8.30907 3.50378 8.99019 4.20761L18.106 13.698C18.2422 13.8342 18.6622 14.2656 19.0936 13.9477C19.5363 13.6072 19.2185 13.1077 19.139 12.9147L13.4743 3.51513C13.0883 2.91347 13.077 1.67609 14.1214 1.05172C15.1998 0.416001 16.2329 1.05172 16.6302 1.7215L22.9306 11.8476C23.8274 13.3461 25.2351 14.6062 26.4838 15.1965C27.4488 15.6506 28.198 15.0716 28.3229 14.0613C28.5159 12.4947 28.8224 10.5535 29.3673 8.91875C29.9349 7.20457 31.9328 6.35316 33.6357 7.21593L33.0567 9.4977C32.4777 11.8135 32.4096 14.2429 32.807 16.6041C33.1475 18.5794 33.4881 21.1223 33.4427 23.3814C33.3859 26.787 31.0928 28.2741 29.0381 30.1245C20.172 38.1732 13.724 27.2297 10.5795 25.6745L1.44103 20.6001C0.669084 20.1574 0.498802 19.1243 0.952887 18.3751C1.39562 17.6485 2.30379 17.3307 3.07574 17.728Z" fill="#FFD869" />
        <path d="M30.9791 7.17055C31.2515 7.22731 31.5126 7.30678 31.7737 7.43165L31.1948 9.71343C30.6158 12.0293 30.5477 14.4586 30.945 16.8199C31.2856 18.7951 31.6261 21.338 31.5807 23.5971C31.524 27.0027 29.2308 28.4898 27.1761 30.3402C25.496 31.8614 23.9067 32.7015 22.4082 33.0534C24.4289 33.0875 26.6425 32.3042 29.0265 30.1359C31.0812 28.2855 33.363 26.7984 33.4311 23.3927C33.4765 21.1223 33.136 18.5794 32.7954 16.6155C32.3867 14.2543 32.4662 11.8249 33.0451 9.50909L33.6241 7.22731C32.75 6.78458 31.7851 6.80728 30.9791 7.17055Z" fill="#F2C34E" />
        <path d="M30.9566 15.696C31.2971 17.6712 31.6377 20.2141 31.5923 22.4732C31.5355 25.8788 29.2424 27.366 27.1877 29.2164C23.6458 32.429 20.4899 32.6106 17.7767 31.5776C20.8645 33.4507 24.6561 34.1205 29.0381 30.1359C31.0928 28.2855 33.3746 26.7983 33.4427 23.3927C33.4881 21.1223 33.1475 18.5794 32.807 16.6155C32.4096 14.2542 30.5479 13.3347 30.9566 15.696ZM7.12844 4.41195L17.2318 14.8219C17.3681 14.9581 17.7881 15.3895 18.2195 15.0716C18.6622 14.731 18.3443 14.2315 18.2649 14.0386L17.8221 13.3007L8.99019 4.21896C8.36583 3.57189 7.27602 3.53784 6.54949 4.02598C6.76518 4.1168 6.95816 4.24167 7.12844 4.41195ZM2.54218 10.8146L13.6219 18.7497C13.8262 18.8973 14.3825 19.2946 14.7798 18.8292C15.1317 18.4545 14.8479 18.0232 14.6549 17.7961L4.59692 10.5875C3.92714 10.1221 2.97357 10.1902 2.31514 10.6897C2.39461 10.7351 2.47407 10.7691 2.54218 10.8146ZM14.7684 1.92583L21.0689 12.0519C21.9657 13.5504 23.3733 14.8105 24.6221 15.4008C25.2918 15.7187 25.8595 15.5143 26.1887 15.0262C25.0194 14.3905 23.7707 13.2326 22.9306 11.8476L16.6302 1.7215C16.2329 1.05172 15.1998 0.416001 14.1214 1.05172C14.0532 1.08578 14.0078 1.13119 13.9511 1.17659C14.303 1.36958 14.5981 1.64203 14.7684 1.92583ZM10.886 23.0976C11.1698 23.2451 11.8169 23.597 12.1688 23.0181C12.305 22.791 12.271 22.5981 12.1915 22.4278L3.1779 17.8188C2.46272 17.4555 1.66807 17.6145 1.11182 18.1026L10.886 23.0976Z" fill="#F2C34E" />
        <path d="M22.5671 33.6323C18.4804 33.6323 15.1542 30.4765 12.8384 28.2855C11.8394 27.3319 10.9653 26.5146 10.3295 26.1967L1.16837 21.111C0.691585 20.8385 0.351021 20.3958 0.214795 19.8509C0.0558655 19.2606 0.158035 18.6248 0.464542 18.0913C1.0662 17.0696 2.29223 16.695 3.32528 17.2172L11.7713 21.531C11.8621 21.5764 12.0778 21.6786 12.1459 21.6786C12.1118 21.6445 12.021 21.5537 11.8507 21.4175L2.01978 13.891C1.55566 13.5121 1.25122 12.9723 1.16708 12.3791C1.08293 11.7859 1.22525 11.1827 1.5657 10.6897C1.91761 10.1902 2.47387 9.82694 3.10959 9.72477C3.7226 9.61125 4.32427 9.74747 4.80106 10.088L14.8023 17.2512C15.0066 17.4102 15.0861 17.4215 15.1088 17.4215C15.0974 17.4102 15.0747 17.3193 14.9272 17.1604L5.64111 7.37488C4.73294 6.35318 4.85782 4.77524 5.93627 3.77625C6.9012 2.90214 8.5132 2.92484 9.38732 3.82166L18.5031 13.312C18.662 13.471 18.7301 13.4937 18.7642 13.505C18.7528 13.4483 18.6734 13.2893 18.6507 13.2326L12.9746 3.82166C12.6681 3.35622 12.5659 2.6751 12.7135 2.06208C12.8611 1.43771 13.247 0.926868 13.8146 0.586304C15.0974 -0.174288 16.4937 0.427374 17.1068 1.44907L23.3958 11.5752C24.1905 12.9034 25.496 14.1294 26.7107 14.7197C26.8809 14.7992 27.142 14.8673 27.3464 14.7538C27.5507 14.6402 27.6983 14.3791 27.7437 14.0159C27.9253 12.6082 28.2205 10.5194 28.8108 8.77119C29.1287 7.79491 29.8666 7.01161 30.8315 6.61428C31.8078 6.21696 32.9203 6.26237 33.8852 6.73916C34.1236 6.86403 34.2485 7.12513 34.1804 7.38623L33.6014 9.66801C33.0452 11.893 32.9657 14.2089 33.363 16.536C33.8284 19.2038 34.0441 21.5196 34.0101 23.4268C33.9533 26.6394 32.0575 28.2855 30.2185 29.8861C29.9574 30.1132 29.6849 30.3516 29.4238 30.59C26.9718 32.7923 24.6673 33.6323 22.5671 33.6323ZM2.36035 18.1253C1.99708 18.1253 1.65652 18.3183 1.45218 18.6702V18.6816C1.29325 18.9427 1.24784 19.2719 1.31595 19.5671C1.36136 19.7373 1.47488 19.9757 1.72463 20.1233L10.8517 25.1977C11.6237 25.5723 12.5432 26.4465 13.6103 27.4681C17.2316 30.8965 22.1812 35.5963 28.6519 29.7272C28.9243 29.4775 29.1968 29.2504 29.4692 29.012C31.2629 27.4454 32.8181 26.1059 32.8749 23.3927C32.9089 21.565 32.6932 19.3173 32.2505 16.7177C31.8191 14.2316 31.9099 11.7568 32.5003 9.37285L32.9543 7.56786C32.3981 7.39758 31.8078 7.42029 31.2629 7.64733C30.6044 7.91978 30.105 8.45333 29.8893 9.11175C29.333 10.7805 29.0378 12.7785 28.8676 14.1407C28.7768 14.8559 28.4248 15.4349 27.9026 15.73C27.4145 16.0025 26.8128 16.0025 26.2339 15.73C24.8035 15.0489 23.3504 13.6753 22.4423 12.1541L16.1418 2.02802C15.9602 1.73287 15.2677 1.02904 14.405 1.55123C14.1263 1.71199 13.9216 1.9754 13.8346 2.28513C13.7476 2.59485 13.7853 2.92632 13.9395 3.20865L19.6156 12.6196C20.1151 13.6072 19.7859 14.118 19.4339 14.3905C19.1274 14.6175 18.5031 14.89 17.7084 14.1067L8.58132 4.60496C8.12723 4.15087 7.21906 4.15087 6.71956 4.60496C6.02709 5.25203 6.04979 6.12614 6.48117 6.60293L15.7445 16.3658C16.437 17.0923 16.3008 17.7734 15.9375 18.1707C15.7786 18.3524 15.1542 18.9313 14.1325 18.1594L4.14263 11.0076C3.91559 10.8486 3.62043 10.7805 3.30257 10.8373C2.97336 10.894 2.67821 11.0757 2.49657 11.3368C2.13331 11.8476 2.23547 12.6082 2.71226 12.9942L12.5319 20.5093C13.44 21.2245 13.3379 21.8602 13.0881 22.2575C12.827 22.6889 12.2935 23.0862 11.2604 22.5413L2.80308 18.2162C2.66686 18.1594 2.51928 18.1253 2.36035 18.1253ZM7.94559 31.5322C6.30888 31.5289 4.70511 31.0721 3.31236 30.2124C1.9196 29.3527 0.792384 28.1238 0.0558655 26.6621C-0.00881133 26.5264 -0.0176952 26.3707 0.031121 26.2285C0.0799373 26.0863 0.182562 25.9689 0.316964 25.9015C0.600768 25.7653 0.941332 25.8788 1.07756 26.1513C1.73736 27.4569 2.75461 28.5481 4.01078 29.2978C5.26694 30.0475 6.71029 30.4248 8.17264 30.3856C8.4905 30.397 8.7516 30.624 8.7516 30.9419C8.75466 31.0168 8.74253 31.0916 8.71595 31.1617C8.68937 31.2319 8.64888 31.2959 8.59692 31.35C8.54496 31.4041 8.4826 31.4471 8.41359 31.4764C8.34458 31.5058 8.27034 31.5209 8.19534 31.5209C8.11588 31.5322 8.03641 31.5322 7.94559 31.5322ZM7.88883 28.7169H7.83207C6.75773 28.6116 5.72512 28.2465 4.8233 27.6532C3.92147 27.0599 3.17749 26.2561 2.6555 25.3112C2.61908 25.2458 2.59606 25.1738 2.58777 25.0993C2.57948 25.0249 2.58609 24.9495 2.60723 24.8777C2.62836 24.8058 2.66359 24.7389 2.71086 24.6808C2.75813 24.6227 2.81649 24.5746 2.88255 24.5393C3.155 24.3917 3.50691 24.4825 3.65449 24.7663C4.5286 26.3556 6.14061 27.4114 7.94559 27.593C8.2521 27.6271 8.4905 27.8995 8.45644 28.2174C8.42238 28.5012 8.17264 28.7169 7.88883 28.7169Z" fill="#455A64" />
        <path d="M26.9717 8.05602C26.6879 8.05602 26.4382 7.84033 26.4041 7.54518C26.2416 6.09177 25.6699 4.71434 24.7556 3.57293C23.8413 2.43153 22.6218 1.57302 21.2389 1.09717C21.1688 1.07332 21.1042 1.0359 21.0485 0.987047C20.9929 0.938196 20.9475 0.878872 20.9148 0.812461C20.8821 0.74605 20.8629 0.673853 20.8581 0.599992C20.8533 0.526131 20.8631 0.452052 20.887 0.381985C20.9108 0.311918 20.9483 0.247236 20.9971 0.19163C21.046 0.136025 21.1053 0.090586 21.1717 0.0579076C21.2381 0.0252292 21.3103 0.00595144 21.3842 0.0011749C21.458 -0.00360163 21.5321 0.00621665 21.6022 0.0300692C24.8262 1.13123 27.1534 4.03737 27.528 7.43166C27.562 7.73816 27.335 8.02197 27.0285 8.05602H26.9717ZM24.2132 8.62363C23.9407 8.62363 23.691 8.41929 23.6569 8.13549C23.5231 7.25014 23.1763 6.41053 22.6464 5.68879C22.1164 4.96705 21.4192 4.38476 20.6145 3.99196C20.4791 3.92572 20.3754 3.80838 20.3265 3.66574C20.2775 3.5231 20.2872 3.36685 20.3534 3.23137C20.4197 3.09588 20.537 2.99226 20.6797 2.9433C20.8223 2.89433 20.9785 2.90403 21.114 2.97027C22.0829 3.44521 22.9224 4.14756 23.5609 5.01736C24.1994 5.88716 24.618 6.89856 24.7808 7.96521C24.8262 8.27171 24.6105 8.56687 24.304 8.61228C24.2699 8.61228 24.2472 8.62363 24.2132 8.62363Z" fill="#455A64" />
      </svg>
    </div>
  </div>
  <div className="mainDashboard mainDashboard2 ">
    <h1>Create Employee Account</h1>
    <div className="DashContent">
      <div className="form">
        <h3>Create Account</h3>
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
                <input value={Account.fullName} type="text" className="ps-2 " placeholder="Enter the full name"  name='fullName' onChange={getAccountData} />
                <svg className="mt-3" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>
            <div className="col-md-6 position-relative">
            <div className='d-flex '>
            <label className="form-label">USER NAME<span>*</span></label>
            {errorList.userName && (<div className=' pb-1  Message'> <Message  severity="error" text={errorList.userName} /></div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="text" value={Account.userName} className="ps-2" placeholder="@username" name='userName' onChange={getAccountData} />
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_21_1274)">
                    <path d="M19.5924 11.3749C19.243 13.9211 17.8965 16.2242 15.8491 17.7776C13.8017 19.331 11.221 20.0074 8.67486 19.6581C6.1287 19.3087 3.8256 17.9622 2.27221 15.9148C0.718823 13.8674 0.0423963 11.2867 0.391736 8.74057C0.679546 6.63318 1.64798 4.67752 3.14965 3.17122C4.65132 1.66493 6.60399 0.690487 8.71049 0.396196C9.14152 0.339737 9.57577 0.311344 10.0105 0.311195C11.7668 0.308313 13.4903 0.787601 14.993 1.69682C15.206 1.82512 15.3593 2.03278 15.4192 2.27411C15.4791 2.51545 15.4407 2.77069 15.3124 2.98369C15.1841 3.1967 14.9764 3.35001 14.7351 3.4099C14.4937 3.4698 14.2385 3.43137 14.0255 3.30307C12.9559 2.66107 11.7481 2.28453 10.5032 2.20497C9.25824 2.1254 8.01235 2.34511 6.86973 2.84572C5.7271 3.34632 4.72097 4.11328 3.9355 5.08241C3.15002 6.05155 2.60805 7.19469 2.3549 8.41622C2.10176 9.63774 2.14482 10.9021 2.48046 12.1036C2.81611 13.3051 3.43459 14.4087 4.28417 15.3222C5.13374 16.2356 6.18971 16.9324 7.36374 17.3541C8.53777 17.7758 9.79572 17.9103 11.0324 17.7462C12.181 17.5935 13.2813 17.1872 14.2535 16.5567C15.2257 15.9262 16.0455 15.0873 16.6535 14.1009C17.2614 13.1145 17.6424 12.0051 17.7686 10.8533C17.8949 9.70145 17.7634 8.53593 17.3836 7.44119C17.2851 7.17795 17.107 6.95191 16.8742 6.79444C16.6413 6.63698 16.3652 6.55589 16.0842 6.56244C15.7139 6.56294 15.3589 6.71027 15.097 6.97213C14.8352 7.23398 14.6879 7.589 14.6874 7.95932V13.7499C14.6874 13.9986 14.5886 14.237 14.4128 14.4129C14.237 14.5887 13.9985 14.6874 13.7499 14.6874C13.5012 14.6874 13.2628 14.5887 13.0869 14.4129C12.9111 14.237 12.8124 13.9986 12.8124 13.7499V13.7412C12.1016 14.2776 11.2529 14.6005 10.3653 14.6721C9.47777 14.7436 8.5882 14.561 7.80071 14.1454C7.01322 13.7298 6.36039 13.0985 5.91861 12.3254C5.47684 11.5523 5.2644 10.6693 5.30616 9.77991C5.34792 8.89046 5.64215 8.03131 6.15441 7.303C6.66668 6.57469 7.37578 6.00735 8.19875 5.66737C9.02171 5.32739 9.92448 5.22885 10.8014 5.38327C11.6783 5.53769 12.4932 5.93868 13.1505 6.53932C13.4161 5.98615 13.8322 5.51902 14.351 5.19148C14.8699 4.86394 15.4706 4.68925 16.0842 4.68744C16.755 4.68098 17.4112 4.88357 17.9615 5.26707C18.5119 5.65056 18.9292 6.19594 19.1555 6.82744C19.6607 8.28695 19.8105 9.84594 19.5924 11.3749ZM9.99986 7.18744C9.4436 7.18744 8.89983 7.3524 8.43732 7.66144C7.97481 7.97048 7.61432 8.40973 7.40145 8.92365C7.18858 9.43756 7.13288 10.0031 7.2414 10.5486C7.34992 11.0942 7.61779 11.5953 8.01112 11.9887C8.40446 12.382 8.9056 12.6499 9.45117 12.7584C9.99674 12.8669 10.5622 12.8112 11.0762 12.5984C11.5901 12.3855 12.0293 12.025 12.3384 11.5625C12.6474 11.1 12.8124 10.5562 12.8124 9.99994C12.8115 9.25428 12.515 8.53939 11.9877 8.01212C11.4604 7.48485 10.7455 7.18827 9.99986 7.18744Z" fill="#9A9A9A" />
                  </g>
                  <defs>
                    <clipPath id="clip0_21_1274">
                      <rect width={20} height={20} fill="white" transform="matrix(1 0 0 -1 0 20)" />
                    </clipPath>
                  </defs>
                </svg>
              </div> 
            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">PHONE NUMBER<span>*</span></label>
              {errorList.phoneNumber && (<div className='text-danger pb-1 Message'><Message  severity="error" text={errorList.phoneNumber} /></div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="tel" value={Account.phoneNumber} className="ps-2" placeholder="+9705998822334" name='phoneNumber' onChange={getAccountData} />
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
                <input type="email" value={Account.email} className="ps-2" placeholder="Enter mail address" name='email' onChange={getAccountData} />
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
                <input type="password" className="ps-2" value={Account.password} placeholder="Enter the password" name='password' onChange={getAccountData} />
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C12.5304 17 13.0391 16.7893 13.4142 16.4142C13.7893 16.0391 14 15.5304 14 15C14 14.4696 13.7893 13.9609 13.4142 13.5858C13.0391 13.2107 12.5304 13 12 13C11.4696 13 10.9609 13.2107 10.5858 13.5858C10.2107 13.9609 10 14.4696 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17ZM18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V10C4 9.46957 4.21071 8.96086 4.58579 8.58579C4.96086 8.21071 5.46957 8 6 8H7V6C7 4.67392 7.52678 3.40215 8.46447 2.46447C9.40215 1.52678 10.6739 1 12 1C12.6566 1 13.3068 1.12933 13.9134 1.3806C14.52 1.63188 15.0712 2.00017 15.5355 2.46447C15.9998 2.92876 16.3681 3.47995 16.6194 4.08658C16.8707 4.69321 17 5.34339 17 6V8H18ZM12 3C11.2044 3 10.4413 3.31607 9.87868 3.87868C9.31607 4.44129 9 5.20435 9 6V8H15V6C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3Z" fill="#9A9A9A" />
                </svg>
              </div>
            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">Repeat Password<span>*</span></label>
              <div className='d-flex no-warp'>
              {copy.cPassword && (<div className='text-danger pb-1 ps-3 Message'><Message  severity="error" text={copy.cPassword}  /></div>)}   
              {errorList.cPassword && (<div className='pb-1 Message '><Message  severity="error" text={errorList.cPassword}  /> </div>)} 
              </div>
                             
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="password" value={Account.cPassword} className="ps-2" placeholder="Repeat Password" id="Repeat Password" name='cPassword' onChange={getAccountData}/>
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
                <input type="time" value={Account.startChecking} className="ps-2" placeholder="8:0000" name='startChecking' onChange={getAccountData} />
              </div>
              
            </div>
            <div className="col-md-6 position-relative">
              <div className="d-flex">
              <label className="form-label">END CHEKING<span>*</span></label>
              {errorList.endChecking && (<div className='\ pb-1 Message'><Message  severity="error" text={errorList.endChecking}  /> </div>)}                              
              </div>
              <div className="mb-3 d-flex createInputs ">
                <input type="time" value={Account.endChecking} className="ps-2" placeholder="8:00"   name='endChecking' onChange={getAccountData}/>
              </div>
            </div>
            <button type='submit' className='m-auto mt-4'>Save</button>
          </div>
        </form>
      </div>
      
    </div>
  </div>
</div>
    </div>)}
    </>
  )
}

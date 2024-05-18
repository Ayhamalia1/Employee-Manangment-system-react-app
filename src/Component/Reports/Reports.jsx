import React, { useState ,useEffect , useRef } from 'react'
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import Swal from 'sweetalert2';
import { useNavigate  } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { Calendar } from "primereact/calendar";

export default function Reports(props) {

  let token=localStorage.getItem('token');
  let [TotalPages, setTotalPages] = useState();
  let [reports,setReports]=useState([]);
  let [duration,setDuration] = useState({
    "startDuration":"",
    "endDuration":""
  })
  const regexPattern = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
  let[loading,setLoading] =useState(false);
  let Navigate=useNavigate();
  //duration data
  function DurationData(e){
    let{name,value}=e.target;
    console.log(name,value);
    setDuration({...duration,[name]:value});  
  }
    //Pagination
    function handlePageChange(data){
      getAllReports({startDuration:duration.startDuration,endDuration:duration.endDuration,page:data.selected+1,perPage:7})
    }
  //get all reports
  const allReports =(params = {})=>{
    setLoading(true);
    getAllReports(params);
  }
  const getAllReports =async(params = {})=>{  
    try{  
     let{data}=await axios.get("https://staff-scanner.vercel.app/attendance/allReportsComp",{headers:{"Authorization":`Bearer ${token}`},
     params: params
    })
    console.log(data.page)
       setTotalPages(data.totalPages)
       setReports(data.employees);
       setLoading(false);
       setDuration({...duration,startDuration:data.startDuration,endDuration:data.endDuration})
     }
     catch(e){
      setLoading(false);
      if(e.response.data.message!=="validation error"){
        Swal.fire({
          html: `
          <div className="errorMsg">
           <p class="errorMsg">${e.response.data.message}</p>
          </div>`,
          icon: 'error',
          customClass: {
            title: 'my-custom-title',
            confirmButton: 'my-custom-button',
          },
        });
      }
      else{
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
    }
   }
  //get Excel Report
  const getExcelReport =async(id)=>{
    try { 
      let { data } = await axios.get(`https://staff-scanner.vercel.app/attendance/reportComp/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }, params: {
          startDuration:duration.startDuration,
          endDuration:duration.endDuration, 
          excel:true       
        },
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx'); // Set a filename for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    }
    catch(e){
      setLoading(false);
      if(e.response.data.message!=="validation error"){
        Swal.fire({
          html: `
          <div className="errorMsg">
           <p class="errorMsg">${e.response.data.message}</p>
          </div>`,
          icon: 'error',
          customClass: {
            title: 'my-custom-title',
            confirmButton: 'my-custom-button',
          },
        });
      }
      else{
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
    }


  };
  //get specific Employee report
  function getEmployeeReport(id){
    if(regexPattern.test(duration.startDuration)){
      Navigate(`/EmployeeReport/${id}?startDuration=${duration.startDuration}&endDuration=${duration.endDuration}`);
    }
    else{
      Navigate(`/EmployeeReport/${id}?startDuration=${duration.startDuration.toLocaleDateString('en-GB')}&endDuration=${duration.endDuration.toLocaleDateString('en-GB')}`);

    }
    }
  useEffect(() => {
    allReports({page:1,perPage:7});
     }, []);
  
  return (
    <>
    {loading?(<Loader/>):(
           <div className='d-flex overflow-x-hidden'>
           <Sidebar logout={props.logout}/>    
       <div className="DashSide">
         <div className=" mainDashboard mainDashboard4">
           <h1>Employees Report</h1>   
           <div>
           </div>
           <div className="WelcomeSection ">
          </div>
          <div className='durtion'>
          <div className=" d-flex">
           <div className="dateInput">
           <label>Start Duration</label>
           <Calendar  value={duration.startDuration} onChange={DurationData} dateFormat='dd/mm/yy'  placeholder='Enter Start duration'   name="startDuration"  maxDate={new Date()}/>
           </div>
           <div className="dateInput">
           <label>End Duration</label>
           <Calendar value={duration.endDuration} dateFormat='dd/mm/yy' onChange={DurationData}  placeholder='Enter End duration'   name="endDuration" maxDate={new Date()}/>
           </div>
           <button onClick={()=>{allReports({ page: 1,perPage: 7,startDuration:duration.startDuration.toLocaleDateString('en-GB'), endDuration:duration.endDuration.toLocaleDateString('en-GB')})}} className='reportBtn'>
            <svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill='white' d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>
             Get Report</button>
          </div>
          </div>
           <div className="DashContent  ">
             <div className="EmployeeTable ">
              <div className='d-flex justify-content-between '>
               <h2 className="tableTitle">Employees Report</h2>
               <div className=' mb-2  '>
               <div className=''>
               {/* <label className='fs-5 '>Start Duration :</label> */}
               <input type="text" className='border-0 fs-5 durationLabels' value={regexPattern.test(duration.startDuration)?
               "Start Duration :"+duration.startDuration+" ": ""}></input>
               </div>
               <div>
               <input type="text" className='border-0 fs-5 durationLabels' value={regexPattern.test(duration.endDuration)?
               " End Duration :"+duration.endDuration: ""}></input>
               </div>
               </div>
               </div>
               <table className="table">
                 <thead>
                   <tr className=" headerOfreview">
                     <th>Employee Name</th>
                     <th className=''>Total Houres</th>
                     <th className=''>Correct Checks</th>
                     <th className=''>Not Correct Checks</th>
                     <th>Employee Report</th>
                   </tr>
                 </thead>
                 <tbody className="tableBody">
                   {reports && reports.map((report,index)=>              
                               <tr key={index}>
                               <td className=''>{report.name}</td>
                               <td className='activeUn'>{report.totalHours}</td>
                               <td className='correct'>{report.correctChecks}</td>
                               <td className='Notcorrect'>{report.notCorrectChecks}</td>
                               <td><button onClick={()=>{getEmployeeReport(report.employeeId)}} className='reportBtn'><svg fill='white' className='mb-1' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill='white' d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg> Get Report</button>
                               <button onClick={()=>{getExcelReport(report.employeeId)}} className='reportBtn ms-2'><i class="fa-solid fa-file-arrow-down ps-1"></i> Excel Report </button></td>
                             </tr> 
                               )}
                 </tbody>
               </table>
           </div>
           </div>
           <div className="pag">
           <Pagination  handlePageChange ={handlePageChange} PagesCount={TotalPages}/>
           </div>
         </div>
       </div>
          </div>)
    }
 
   </>
  )
}

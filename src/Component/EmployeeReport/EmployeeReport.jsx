import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import Swal from 'sweetalert2';
import { Calendar } from "primereact/calendar";
import Loader from '../Loader/Loader';


export default function EmployeeReport() {
  const token = localStorage.getItem('token')
  const {id} = useParams();
  const urlParams = new URLSearchParams(window.location.search);
    let [duration, setDuration] = useState({
    "startDuration": urlParams.get('startDuration'),
    "endDuration": urlParams.get('endDuration')
  })
  let[loading,setLoading] =useState(false);
  let [reportData, setReportData] = useState([]);
  let [notCorrectChecks, setNotCorrectChecks] = useState([]);
  let[solveCheck, setSolveCheck] = useState(
    {"attendanceId":"",
    "checkOutTime":""});
  let [totalHours,setTotalHours] = useState();
  let [fullName, setFullName] = useState('')
  const [scrollPosition, setScrollPosition] = useState(0);

  //duration data
  function DurationData(e) {
    let name = e.target.name;
    let value = e.target.value.toLocaleDateString('en-GB');
      setDuration({ ...duration, [name]: value });   
  }
  //get Report
  const getEmployeeReport =async (params = {},responseType = 'json') => {
      setLoading(true);
      const defaultParams = {};
      const queryParams = { ...defaultParams, ...params };
      try {
        let { data } = await axios.get(`https://staff-scanner.vercel.app/attendance/reportComp/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
          params: queryParams,
          responseType: responseType
        })
        if(responseType === 'blob'){
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'report.xlsx'); // Set a filename for the downloaded file
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          getEmployeeReport({startDuration:duration.startDuration,endDuration:duration.endDuration});
        }
        setReportData(data.days);
        setFullName(data.fullName);
        setNotCorrectChecks(data.notCorrectChecks);
        setTotalHours(data.totalHours);
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
  }
  // get solv check date
  function getCheckDate(e,id){
    let name=e.target.name
    let value=e.target.value;
    setSolveCheck({...solveCheck,[name]:value,"attendanceId":id});
  }

  //Solve check out
  async function solveCheckOut(){
    setLoading(true);
    try{ 
    let{data}=await axios.patch("https://staff-scanner.vercel.app/attendance/solveCheckOut",solveCheck,
    { headers: { "Authorization": `Bearer ${token}`}});
      getEmployeeReport({startDuration:duration.startDuration,endDuration:duration.endDuration},'json');
      setLoading(false);
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
  useEffect(() => {
    getEmployeeReport({startDuration:duration.startDuration,endDuration:duration.endDuration},'json');
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
    {loading?(<Loader/>):(
          <div className="EmpReport ">
          <div className='d-flex '>
            <div className='notCorrectChecks'>
              <div className="EmployeeTable ">
                <h2 className="tableTitle">Not Correct Checks</h2>
                <table className="table">
                  <thead>
                    <tr className=" headerOfreview">
                      <th>The Date</th>
                      <th className=''>Enter Time</th>
                      <th className=''>Shift End</th>
                      <th className=''>Solve Check out</th>
  
                    </tr>
                  </thead>
                  <tbody className="tableBody ">
                    {notCorrectChecks && notCorrectChecks.map((check, index) =>
                      <tr key={index}>
                        <td className=''>{check.day}</td>
                        <td className=''>{check.enterTime}</td>
                        <td className=''>{check.shiftEnd}</td>
                        <td className=' '>
                        <div className='d-flex solve'>
                        <input type='time' onChange={(e)=>getCheckDate(e,check.attendaceId)} name='checkOutTime'></input>
                        <button onClick={solveCheckOut} className='reportBtn'>Solve</button>
                        </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className=" durtion">
            <div className="dateInput">
           <label>Start Duration</label>
           <Calendar className='Calendar'  dateFormat='dd/mm/yy' onChange={DurationData}   placeholder='Enter Start duration'   name="startDuration"  maxDate={new Date()}/>
           </div>
           <div className="dateInput position-relative">
           <label>End Duration   </label>
           <Calendar className='Calendar ' dateFormat='dd/mm/yy'  onChange={DurationData}  placeholder='Enter End duration'   name="endDuration" maxDate={new Date()}/>
           </div>
              <div className='d-flex justify-content-center'>
              <button onClick={()=>{getEmployeeReport({
                startDuration:duration.startDuration,endDuration:duration.endDuration},'json')}}
                className='reportBtn'><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill='white' d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" /></svg> Get Report</button>
              <button className='reportBtn' onClick={()=>
              {getEmployeeReport({startDuration:duration.startDuration,
               endDuration:duration.endDuration, excel:true },'blob')}}> <i class="fa-solid fa-file-arrow-down ps-1"></i> Excel Report</button>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="90%" height="35%" style={{ position: 'relative', top: '50px',overflowY:"auto" }}>
        <AreaChart
          width={500}
          height={400}
          data={reportData}
          margin={{
            top: 30,
            right: 30,
            left: 250,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="hours" stroke="#59C1BD" fill="#59C1BD" />
        </AreaChart>
      </ResponsiveContainer>
         
          <div className="DashContent  ">
              <div className="EmployeeTable ">
                <h2 className="tableTitle">{fullName} Report</h2>
                <table className="table">
                  <thead>
                    <tr className=" headerOfreview">
                      <th>The Date</th>
                      <th className=''>Enter Time</th>
                      <th className=''>Leave Time</th>
                      <th className=''>Hours</th>
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {reportData && reportData.map((report, index) =>
                      <tr key={index}>
                        <td className=''>{report.day}</td>
                        <td className=''>{report.enterTime}</td>
                        <td className=''>{report.leaveTime}</td>
                        <td className=''>{report.hours}</td>                   
                         </tr>
                    )}
                <tr className={scrollPosition < 225 ? '' : 'fix'}> <div className='d-flex justify-content-between'><p  className='total'>Total Hours</p><input type="text" className='label ' value={totalHours}></input> </div></tr>
                  </tbody>
                </table>
              </div>
            </div>
  
        </div>)
    }
    

    </>
  )
}

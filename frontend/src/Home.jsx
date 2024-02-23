import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [data, setData] = useState([])
    useEffect( ()=> {
        axios.get('http://localhost:8081/')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])
  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Patient List</h2>
        <div className='d-flex justify-content-start'>
          <Link to="/create" className='btn btn-success'>Add +</Link>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th> Patient ID </th>
              <th> Patient Name </th>
              <th> Date of Treatment </th>
              <th> Treatment Description </th>
              <th> Medications Prescribed </th>
              <th> Cost </th>
              {/* <th> Action </th> */}
            </tr>
          </thead>
          <tbody>
              {data.map((patient, index) => {
                return <tr key={index}>
                  <td>{patient.PatientId}</td>
                  <td>{patient.PatientName}</td>
                  <td>{patient.DateOfTreatment}</td>
                  <td>{patient.TreatmentDescription}</td>
                  <td>{patient.MedicationsPrescribed}</td>
                  <td>{patient.CostOfTreatment}</td>
                  {/* <td>
                    <button className='btn btn-sm btn-info'>View</button>
                    <button className='btn btn-sm btn-primary mx-2'>Edit</button>
                    <button className='btn btn-sm btn-danger'>Delete</button>
                  </td> */}
                </tr>
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
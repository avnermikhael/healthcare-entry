import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import axios from 'axios';

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

function Read() {
    const {id} = useParams()
    const [patient, setPatient] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8081/read/'+id)
        .then(res => {
            console.log(res)
            setPatient(res.data[0])
        })
        .catch(err => console.log(err))
    }, [])
  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <div className='p-2'>
            <h2>Patient Details</h2>
            <h3>Patient ID : {patient.PatientId}</h3>
            <h3>Patient Name : {patient.PatientName}</h3>
            <h3>Date Of Treatment : {formatDate(patient.DateOfTreatment)}</h3>
            <h3>Treatment Description : {patient.TreatmentDescription}</h3>
            <h3>Medications Prescribed : {patient.MedicationsPrescribed}</h3>
            <h3>Treatment Cost : {patient.CostOfTreatment} IDR</h3>
        </div>
        <Link to={`/edit/${patient.PatientId}`} className='btn btn-warning' style={{ marginRight: '10px' }}>
            Edit
        </Link>
        <Link to="/" className='btn btn-danger'>Cancel</Link>
      </div>
    </div>
  )
}

export default Read
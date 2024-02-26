import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function Read() {
  const { id } = useParams()
  const [patient, setPatient] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8081/read/${id}`)
      .then(res => {
        setPatient(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-75 bg-white rounded p-3'>
        <h2 className="text-center mb-4">Patient Details</h2>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td><h5>Patient ID</h5></td>
              <td>{patient.PatientId}</td>
            </tr>
            <tr>
              <td><h5>Patient Name</h5></td>
              <td>{patient.PatientName}</td>
            </tr>
            <tr>
              <td><h5>Date Of Treatment</h5></td>
              <td>{formatDate(patient.DateOfTreatment)}</td>
            </tr>
            <tr>
              <td><h5>Treatment Description</h5></td>
              <td>{patient.TreatmentDescription}</td>
            </tr>
            <tr>
              <td><h5>Medications Prescribed</h5></td>
              <td>{patient.MedicationsPrescribed}</td>
            </tr>
            <tr>
              <td><h5>Treatment Cost</h5></td>
              <td>{patient.CostOfTreatment} IDR</td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-left">
          {/* <Link to={`/edit/${patient.PatientId}`} className='btn btn-warning mr-2' style={{ marginRight: '10px' }}>
            Edit
          </Link> */}
          <Link to="/" className='btn btn-danger'>
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Read;

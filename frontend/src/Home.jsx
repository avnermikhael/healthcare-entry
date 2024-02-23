import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// const handleDelete = (id) => {
//   axios.delete('http://localhost:8081/delete/'+id)
//   .then(res => {
//     location.reload();
//   })
//   .catch(err => console.log(err));
// }

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-80 h-60 bg-white rounded p-3'>
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
            {data.map((patient, index) => (
              <tr key={index}>
                <td>{patient.PatientId.substring(0, 8)}</td>
                <td>{patient.PatientName}</td>
                <td>{formatDate(patient.DateOfTreatment)}</td>
                <td>{patient.TreatmentDescription}</td>
                <td>{patient.MedicationsPrescribed}</td>
                <td>{patient.CostOfTreatment} IDR</td>
                {/* <td>
                  <Link to={`/read/${patient.PatientId}`} className='btn btn-sm btn-info'>View</Link>
                  <Link to={`/edit/${patient.PatientId}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                  <button onClick={() => handleDelete(patient.PatientId)} className='btn btn-sm btn-danger'>Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;

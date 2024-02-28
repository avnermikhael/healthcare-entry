import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const handleDelete = (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this data?");
  if (isConfirmed) {
    axios.delete(`http://localhost:8081/delete/${id}`)
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  }
}

function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sortBy, setSortBy] = useState('PatientName');
  const [sortOrder, setSortOrder] = useState('asc');

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, sortBy, sortOrder]);

  const fetchData = () => {
    axios.get(`http://localhost:8081/?page=${currentPage}&per_page=${itemsPerPage}&sort_by=${sortBy}&sort_order=${sortOrder}`)
      .then(res => {
        setData(res.data.patients);
        setTotalPages(Math.ceil(res.data.total / itemsPerPage));
      })
      .catch(err => console.log(err));
  };  

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortBy(key);
    setCurrentPage(1);
  };

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
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('PatientName')}>
                <span>Patient Name</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('DateOfTreatment')}>
                <span>Date of Treatment</span>
              </th>
              <th> Treatment Description </th>
              <th> Medications Prescribed </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('CostOfTreatment')}>
                <span>Cost</span>
              </th>
              <th> Action </th>
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
                <td>
                  <Button variant="info" size="sm" style={{ marginRight: '5px' }} onClick={() => handleView(patient)}>View</Button>
                  <button onClick={() => handleDelete(patient.PatientId)} className='btn btn-sm btn-danger' >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={nextPage} disabled={currentPage === totalPages} />
          </Pagination>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Patient Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient && (
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td><h5>Patient ID</h5></td>
                    <td>{selectedPatient.PatientId}</td>
                  </tr>
                  <tr>
                    <td><h5>Patient Name</h5></td>
                    <td>{selectedPatient.PatientName}</td>
                  </tr>
                  <tr>
                    <td><h5>Date Of Treatment</h5></td>
                    <td>{formatDate(selectedPatient.DateOfTreatment)}</td>
                  </tr>
                  <tr>
                    <td><h5>Treatment Description</h5></td>
                    <td>{selectedPatient.TreatmentDescription}</td>
                  </tr>
                  <tr>
                    <td><h5>Medications Prescribed</h5></td>
                    <td>{selectedPatient.MedicationsPrescribed}</td>
                  </tr>
                  <tr>
                    <td><h5>Treatment Cost</h5></td>
                    <td>{selectedPatient.CostOfTreatment} IDR</td>
                  </tr>
                </tbody>
              </table>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Home;

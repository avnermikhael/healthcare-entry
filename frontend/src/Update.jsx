import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Select from 'react-select';

function Update() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/read/'+id)
      .then(res => {
        console.log(res.data[0]);
        setPatientData(res.data[0]);
      })
      .catch(err => console.log(err));
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z\s]*$/, 'Name should contain only alphabets and spaces').required('Name is required'),
    date: Yup.date().required('Date Of Treatment is required'),
    cost: Yup.number().typeError('Cost must be a number').required('Cost is required'),
    treatment: Yup.array().min(1, 'At least one option must be selected for Treatment Description').required('Treatment is required'),
    medication: Yup.array().min(1, 'At least one option must be selected for Medications Prescribed').required('Medications is required')
  });

  const handleSubmit = (values) => {
    axios.put(`http://localhost:8081/patient/`+id, values)
      .then(res => {
        console.log(res);
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  const formik = useFormik({
    initialValues: {
      name: patientData?.PatientName || '',
      date: patientData?.DateOfTreatment || '',
      treatment: patientData?.TreatmentDescription ? patientData.TreatmentDescription.split(',').map(option => ({ value: option, label: option })) : [],
      medication: patientData?.MedicationsPrescribed ? patientData.MedicationsPrescribed.split(',').map(option => ({ value: option, label: option })) : [],
      cost: patientData?.CostOfTreatment || ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  const treatmentOptions = [
    { value: 'Influenza', label: 'Influenza' },
    { value: 'Fever', label: 'Fever' },
    { value: 'Vomit', label: 'Vomit' },
    { value: 'Rash', label: 'Rash' }
  ];

  const medicationOptions = [
    { value: 'Acetaminophen', label: 'Acetaminophen' },
    { value: 'Colchicine', label: 'Colchicine' },
    { value: 'Omeprazole', label: 'Omeprazole' },
    { value: 'Hydrocortisone', label: 'Hydrocortisone' }
  ];

  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Update Patient</h2>
        {patientData ? (
          <form onSubmit={formik.handleSubmit}>
            <div className='mb-2'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Patient Name'
                className={`form-control ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name && <div className='invalid-feedback'>{formik.errors.name}</div>}
            </div>
            <div className='mb-2'>
              <label htmlFor='date'>Date Of Treatment</label>
              <input
                type='date'
                id='date'
                name='date'
                className='form-control'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className='mb-2'>
              <label htmlFor='treatment'>Treatment Description</label>
              <Select
                id='treatment'
                name='treatment'
                options={treatmentOptions}
                isMulti
                onChange={(selectedOptions) => formik.setFieldValue('treatment', selectedOptions ? selectedOptions.map(option => option.value) : [])}
                onBlur={formik.handleBlur}
                className={`form-control ${formik.errors.treatment && formik.touched.treatment ? 'is-invalid' : ''}`}
                value={formik.values.treatment}
              />
              {formik.errors.treatment && formik.touched.treatment && <div className='invalid-feedback'>{formik.errors.treatment}</div>}
            </div>
            <div className='mb-2'>
              <label htmlFor='medication'>Medications Prescribed</label>
              <Select
                id='medication'
                name='medication'
                options={medicationOptions}
                isMulti
                onChange={(selectedOptions) => formik.setFieldValue('medication', selectedOptions ? selectedOptions.map(option => option.value) : [])}
                onBlur={formik.handleBlur}
                className={`form-control ${formik.errors.medication && formik.touched.medication ? 'is-invalid' : ''}`}
                value={formik.values.medication}
              />
              {formik.errors.medication && formik.touched.medication && <div className='invalid-feedback'>{formik.errors.medication}</div>}
            </div>
            <div className='mb-2'>
              <label htmlFor='cost'>Cost of Treatment</label>
              <input
                type='number'
                id='cost'
                name='cost'
                className={`form-control ${formik.errors.cost && formik.touched.cost ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cost}
              />
              {formik.errors.cost && formik.touched.cost && <div className='invalid-feedback'>{formik.errors.cost}</div>}
            </div>
            <button type='submit' className='btn btn-success' style={{ marginRight: '10px' }}>
              Submit
            </button>
            <Link to="/" className='btn btn-danger'>Cancel</Link>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Update;

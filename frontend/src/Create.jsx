import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Select from 'react-select';

function Create() {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    date: '',
    treatment: [],
    medication: [],
    cost: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z\s]*$/, 'Name should contain only alphabets and spaces').required('Name is required'),
    date: Yup.date().required('Date Of Treatment is required'),
    cost: Yup.number().typeError('Cost must be a number').required('Cost is required'),
    treatment: Yup.array().min(1, 'At least one option must be selected for Treatment Description').required('Treatment is required'),
    medication: Yup.array().min(1, 'At least one option must be selected for Medications Prescribed').required('Medications is required')
  });

  const handleSubmit = (values) => {
    axios.post('http://localhost:8081/patient', values)
      .then(res => {
        console.log(res);
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });

  const treatmentOptions = [
    { value: 'Dhiarrhea', label: 'Dhiarrhea' },
    { value: 'Fever', label: 'Fever' },
    { value: 'Gastroesophageal Reflux Disease', label: 'Gastroesophageal Reflux Disease' },
    { value: 'Gout', label: 'Gout' },
    { value: 'Headache', label: 'Headache' },
    { value: 'Influenza', label: 'Influenza' },
    { value: 'Rash', label: 'Rash' },
    { value: 'Vomit', label: 'Vomit' }
  ];

  const medicationOptions = [
    { value: 'Acetaminophen', label: 'Acetaminophen' },
    { value: 'Colchicine', label: 'Colchicine' },
    { value: 'Hydrocortisone', label: 'Hydrocortisone' },
    { value: 'Ibuprofen', label: 'Ibuprofen' },
    { value: 'Loperamide', label: 'Loperamide' },
    { value: 'Omeprazole', label: 'Omeprazole' },
    { value: 'Ondansetron', label: 'Ondansetron' },
    { value: 'Pseudoephedrine', label: 'Pseudoephedrine' }
  ];

  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Add Patient</h2>
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
      </div>
    </div>
  );
}

export default Create;
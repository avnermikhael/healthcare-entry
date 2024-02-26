import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Select from 'react-select';

function Update() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    PatientName: '',
    DateOfTreatment: '',
    TreatmentDescription: [],
    MedicationsPrescribed: [],
    CostOfTreatment: ''
  };

  const validationSchema = Yup.object().shape({
    PatientName: Yup.string().matches(/^[a-zA-Z\s]*$/, 'Name should contain only alphabets and spaces').required('Name is required'),
    DateOfTreatment: Yup.date().required('Date Of Treatment is required'),
    CostOfTreatment: Yup.number().typeError('Cost must be a number').required('Cost is required'),
    TreatmentDescription: Yup.array().min(1, 'At least one option must be selected for Treatment Description').required('Treatment is required'),
    MedicationsPrescribed: Yup.array().min(1, 'At least one option must be selected for Medications Prescribed').required('Medications is required')
  });

  const handleSubmit = (values) => {
    axios.put(`http://localhost:8081/update/${id}`, values)
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

  useEffect(() => {
    axios.get(`http://localhost:8081/read/${id}`)
      .then(res => {
        const { PatientName, DateOfTreatment, TreatmentDescription, MedicationsPrescribed, CostOfTreatment } = res.data;
        formik.setValues({ PatientName, DateOfTreatment, TreatmentDescription, MedicationsPrescribed, CostOfTreatment });
      })
      .catch(err => console.log(err));
  }, [id, formik]);

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
        <h2>Update Patient</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-2'>
            <label htmlFor='PatientName'>Name</label>
            <input
              type='text'
              id='PatientName'
              name='PatientName'
              placeholder='Patient Name'
              className={`form-control ${formik.errors.PatientName && formik.touched.PatientName ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.PatientName}
            />
            {formik.errors.PatientName && formik.touched.PatientName && <div className='invalid-feedback'>{formik.errors.PatientName}</div>}
          </div>
          <div className='mb-2'>
            <label htmlFor='DateOfTreatment'>Date Of Treatment</label>
            <input
              type='date'
              id='DateOfTreatment'
              name='DateOfTreatment'
              className='form-control'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DateOfTreatment}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='TreatmentDescription'>Treatment Description</label>
            <Select
              id='TreatmentDescription'
              name='TreatmentDescription'
              options={treatmentOptions}
              isMulti
              onChange={(selectedOptions) => formik.setFieldValue('TreatmentDescription', selectedOptions ? selectedOptions.map(option => option.value) : [])}
              onBlur={formik.handleBlur}
              className={`form-control ${formik.errors.TreatmentDescription && formik.touched.TreatmentDescription ? 'is-invalid' : ''}`}
              value={treatmentOptions.filter(option => formik.values.TreatmentDescription.includes(option.value))}
            />
            {formik.errors.TreatmentDescription && formik.touched.TreatmentDescription && <div className='invalid-feedback'>{formik.errors.TreatmentDescription}</div>}
          </div>
          <div className='mb-2'>
            <label htmlFor='MedicationsPrescribed'>Medications Prescribed</label>
            <Select
              id='MedicationsPrescribed'
              name='MedicationsPrescribed'
              options={medicationOptions}
              isMulti
              onChange={(selectedOptions) => formik.setFieldValue('MedicationsPrescribed', selectedOptions ? selectedOptions.map(option => option.value) : [])}
              onBlur={formik.handleBlur}
              className={`form-control ${formik.errors.MedicationsPrescribed && formik.touched.MedicationsPrescribed ? 'is-invalid' : ''}`}
              value={medicationOptions.filter(option => formik.values.MedicationsPrescribed.includes(option.value))}
            />
            {formik.errors.MedicationsPrescribed && formik.touched.MedicationsPrescribed && <div className='invalid-feedback'>{formik.errors.MedicationsPrescribed}</div>}
          </div>
          <div className='mb-2'>
            <label htmlFor='CostOfTreatment'>Cost of Treatment</label>
            <input
              type='number'
              id='CostOfTreatment'
              name='CostOfTreatment'
              className={`form-control ${formik.errors.CostOfTreatment && formik.touched.CostOfTreatment ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.CostOfTreatment}
            />
            {formik.errors.CostOfTreatment && formik.touched.CostOfTreatment && <div className='invalid-feedback'>{formik.errors.CostOfTreatment}</div>}
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

export default Update;